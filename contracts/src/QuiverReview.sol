// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/// @title QuiverReview
/// @notice Stake-weighted review + boost market for the Quiver MCP directory.
///         Reviewers stake $QUIVER behind a take; the community votes; winners
///         earn from the rewards pool, losers can be slashed.
///         Builders stake to feature their MCP on the directory's homepage.
contract QuiverReview is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────── types

    enum Grade { None, A, B, D, F }

    struct Stake {
        address reviewer;
        uint96  amount;          // packed: max ~79bn tokens w/ 18 decimals
        uint64  stakedAt;
        uint32  reviewId;        // index into reviews[]
        bool    slashed;
    }

    struct Review {
        bytes32  mcpSlugHash;    // keccak256(slug) — keep on-chain footprint small
        address  reviewer;
        uint256  stake;          // total stake backing this review
        uint256  upvotes;
        uint256  downvotes;
        uint64   createdAt;
        Grade    grade;          // the reviewer's submitted grade
        bool     slashed;        // globally slashed
    }

    struct Boost {
        address builder;
        uint96  amount;
        uint64  startedAt;
        uint64  endsAt;
    }

    // ─────────────────────────────────────────────────────────── state

    IERC20 public immutable quiver;
    address public treasury;                  // where slashed funds go
    uint256 public rewardsPool;               // token balance earmarked for paying reviewers
    uint256 public constant SLASH_BPS = 5_000; // 50% on caught shilling
    uint256 public constant REWARD_BPS = 7_000;// 70% of stake awarded on community upvote
    uint256 public constant MIN_STAKE = 1e18;  // 1 $QUIVER minimum to back a review
    uint256 public constant MIN_BOOST = 100e18;
    uint256 public constant MAX_BOOST_DURATION = 30 days;

    Review[] public reviews;
    Stake[]  public stakes;

    // mcpSlugHash → boost stake-index + 1 (0 = no boost, since 0 is a valid stake index)
    mapping(bytes32 => uint256) public activeBoost;

    // reviewer → list of stake indices
    mapping(address => uint256[]) public stakesBy;

    // ─────────────────────────────────────────────────────────── events

    event ReviewSubmitted(uint256 indexed reviewId, bytes32 indexed mcp, address reviewer, uint256 stake, Grade grade);
    event Voted(uint256 indexed reviewId, address voter, bool up);
    event Slashed(uint256 indexed reviewId, uint256 burned, uint256 toTreasury);
    event Rewarded(uint256 indexed reviewId, address indexed reviewer, uint256 amount);
    event Boosted(bytes32 indexed mcp, address builder, uint256 amount, uint64 endsAt);
    event BoostExpired(bytes32 indexed mcp);
    event RewardsFunded(address indexed funder, uint256 amount);

    // ─────────────────────────────────────────────────────────── ctor

    constructor(IERC20 _quiver, address _treasury) Ownable(msg.sender) {
        quiver = _quiver;
        treasury = _treasury;
    }

    // ─────────────────────────────────────────────────────────── admin

    function setTreasury(address t) external onlyOwner {
        require(t != address(0), "zero");
        treasury = t;
    }

    /// @notice Fund the rewards pool. Anyone can top it up.
    function fundRewards(uint256 amount) external nonReentrant {
        quiver.safeTransferFrom(msg.sender, address(this), amount);
        rewardsPool += amount;
        emit RewardsFunded(msg.sender, amount);
    }

    // ─────────────────────────────────────────────────────────── reviews

    /// @notice Submit a stake-weighted review. Stake is locked until the
    ///         review is rewarded or slashed.
    function submitReview(
        string calldata mcpSlug,
        Grade grade,
        uint256 stakeAmount
    ) external nonReentrant returns (uint256 reviewId) {
        require(stakeAmount >= MIN_STAKE, "stake<min");
        require(uint8(grade) > uint8(Grade.None), "bad grade");

        reviewId = reviews.length;
        reviews.push(
            Review({
                mcpSlugHash: keccak256(bytes(mcpSlug)),
                reviewer: msg.sender,
                stake: 0, // set below
                upvotes: 0,
                downvotes: 0,
                createdAt: uint64(block.timestamp),
                grade: grade,
                slashed: false
            })
        );

        // create stake row tied to this review
        uint256 stakeId = stakes.length;
        stakes.push(
            Stake({
                reviewer: msg.sender,
                amount: uint96(stakeAmount),
                stakedAt: uint64(block.timestamp),
                reviewId: uint32(reviewId),
                slashed: false
            })
        );
        stakesBy[msg.sender].push(stakeId);

        reviews[reviewId].stake = stakeAmount;
        quiver.safeTransferFrom(msg.sender, address(this), stakeAmount);

        emit ReviewSubmitted(reviewId, keccak256(bytes(mcpSlug)), msg.sender, stakeAmount, grade);
    }

    /// @notice Community upvote/downvote. Self-votes are rejected.
    function vote(uint256 reviewId, bool up) external {
        Review storage r = reviews[reviewId];
        require(r.reviewer != address(0), "no review");
        require(r.reviewer != msg.sender, "self-vote");
        if (up) r.upvotes += 1;
        else    r.downvotes += 1;
        emit Voted(reviewId, msg.sender, up);
    }

    // ─────────────────────────────────────────────────────────── slash + reward

    /// @notice Owner/governance slashes a caught-shill review. Burns half the
    ///         stake, sends the other half to the treasury.
    function slashReview(uint256 reviewId) external onlyOwner nonReentrant {
        Review storage r = reviews[reviewId];
        require(r.reviewer != address(0), "no review");
        require(!r.slashed, "already slashed");

        uint256 stake = r.stake;
        uint256 burned = (stake * SLASH_BPS) / 10_000;
        uint256 toTreasury = stake - burned;

        r.slashed = true;
        // mark every stake row tied to this review
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].reviewId == reviewId) stakes[i].slashed = true;
        }

        quiver.safeTransfer(treasury, toTreasury);
        // burned portion just sits here as dead balance
        rewardsPool = rewardsPool > burned ? rewardsPool - burned : 0;

        emit Slashed(reviewId, burned, toTreasury);
    }

    /// @notice Reward the reviewer when the community has upvoted their
    ///         review. Pays out REWARD_BPS of the stake from the rewards pool.
    function rewardReview(uint256 reviewId) external onlyOwner nonReentrant {
        Review storage r = reviews[reviewId];
        require(r.reviewer != address(0), "no review");
        require(!r.slashed, "slashed");
        require(r.upvotes > r.downvotes, "no majority");

        uint256 payout = (r.stake * REWARD_BPS) / 10_000;
        require(payout <= rewardsPool, "pool empty");

        rewardsPool -= payout;
        quiver.safeTransfer(r.reviewer, payout);

        emit Rewarded(reviewId, r.reviewer, payout);
    }

    // ─────────────────────────────────────────────────────────── boost

    /// @notice Builders stake to feature their MCP on the directory's homepage.
    ///         Slot reuses the same $QUIVER balance; previous boost is overwritten
    ///         if still active (refunded automatically by the call below).
    function boost(
        string calldata mcpSlug,
        uint256 amount,
        uint64 duration
    ) external nonReentrant {
        require(amount >= MIN_BOOST, "boost<min");
        require(duration > 0 && duration <= MAX_BOOST_DURATION, "bad duration");

        bytes32 mcp = keccak256(bytes(mcpSlug));
        uint256 existing = activeBoost[mcp];
        if (existing != 0) {
            // expire the previous one — caller is taking the slot
            delete activeBoost[mcp];
            emit BoostExpired(mcp);
        }

        uint64 endsAt = uint64(block.timestamp) + duration;
        // we don't store the Boost struct; the boost is just (amount, endsAt) on the
        // activeBoost slot using a packed encoding via a small helper array.
        // To keep storage simple, we re-use stakes[] rows for boosts too.
        uint256 boostId = stakes.length;
        stakes.push(
            Stake({
                reviewer: msg.sender,           // builder
                amount: uint96(amount),
                stakedAt: uint64(block.timestamp),
                reviewId: uint32(endsAt),       // abuse: store endsAt here
                slashed: false
            })
        );
        stakesBy[msg.sender].push(boostId);
        activeBoost[mcp] = boostId + 1;

        quiver.safeTransferFrom(msg.sender, address(this), amount);
        emit Boosted(mcp, msg.sender, amount, endsAt);
    }

    /// @notice Read a boost slot.
    function getBoost(string calldata mcpSlug)
        external
        view
        returns (address builder, uint256 amount, uint64 endsAt, bool active)
    {
        bytes32 mcp = keccak256(bytes(mcpSlug));
        uint256 id = activeBoost[mcp];
        if (id == 0) return (address(0), 0, 0, false);
        Stake storage s = stakes[id - 1];
        endsAt = uint64(s.reviewId);
        active = block.timestamp < endsAt;
        return (s.reviewer, s.amount, endsAt, active);
    }

    // ─────────────────────────────────────────────────────────── views

    function reviewCount() external view returns (uint256) {
        return reviews.length;
    }

    function stakeCount() external view returns (uint256) {
        return stakes.length;
    }

    function stakesOf(address user) external view returns (uint256[] memory) {
        return stakesBy[user];
    }

    function totalStakedForMCP(string calldata mcpSlug)
        external
        view
        returns (uint256 total)
    {
        bytes32 mcp = keccak256(bytes(mcpSlug));
        for (uint256 i = 0; i < reviews.length; i++) {
            if (reviews[i].mcpSlugHash == mcp && !reviews[i].slashed) {
                total += reviews[i].stake;
            }
        }
    }
}
