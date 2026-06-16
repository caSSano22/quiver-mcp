// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {QuiverReview} from "../src/QuiverReview.sol";

/// @dev Minimal mintable ERC20 to stand in for $QUIVER in tests.
contract MockQuiver is ERC20 {
    constructor() ERC20("Quiver", "QUIVER") {}
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract QuiverReviewTest is Test {
    MockQuiver      token;
    QuiverReview    registry;
    address         owner  = address(this);
    address         alice  = address(0xA11CE);
    address         bob    = address(0xB0B);
    address         carol  = address(0xCAFE);
    address         treasury = address(0x7EA5);

    function setUp() public {
        token = new MockQuiver();
        registry = new QuiverReview(token, treasury);
    }

    // ── submit review ─────────────────────────────────────────────

    function test_submitReview_stakesAndRecords() public {
        token.mint(alice, 1_000e18);
        vm.startPrank(alice);
        token.approve(address(registry), 1_000e18);
        uint256 id = registry.submitReview("playwright", QuiverReview.Grade.A, 10e18);
        vm.stopPrank();

        assertEq(id, 0);
        (bytes32 mcp, address reviewer, uint256 stake, , , , QuiverReview.Grade g, ) = registry.reviews(id);
        assertEq(mcp, keccak256(bytes("playwright")));
        assertEq(reviewer, alice);
        assertEq(stake, 10e18);
        assertEq(uint8(g), uint8(QuiverReview.Grade.A));
        assertEq(token.balanceOf(address(registry)), 10e18);
    }

    function test_submitReview_revertsBelowMin() public {
        token.mint(alice, 1e18);
        vm.startPrank(alice);
        token.approve(address(registry), 1e18);
        vm.expectRevert(bytes("stake<min"));
        registry.submitReview("playwright", QuiverReview.Grade.A, 0.5e18);
        vm.stopPrank();
    }

    // ── vote ──────────────────────────────────────────────────────

    function test_vote_incrementsCounters() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 10e18);

        vm.prank(bob);   registry.vote(0, true);
        vm.prank(carol); registry.vote(0, true);
        vm.prank(treasury); registry.vote(0, false);

        (, , , uint256 up, uint256 down,, ,) = registry.reviews(0);
        assertEq(up, 2);
        assertEq(down, 1);
    }

    function test_vote_selfVoteReverts() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 10e18);
        vm.prank(alice);
        vm.expectRevert(bytes("self-vote"));
        registry.vote(0, true);
    }

    // ── slash + reward ────────────────────────────────────────────

    function test_slash_burnsAndSends() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 100e18);
        uint256 balBefore = token.balanceOf(treasury);

        registry.slashReview(0);

        (, , uint256 stake, uint256 up, uint256 down, , , bool slashed) = registry.reviews(0);
        assertTrue(slashed);
        // treasury got 50e18 (the non-burned half)
        assertEq(token.balanceOf(treasury) - balBefore, 50e18);
        // 50e18 burned — sits on the contract as dead balance
        assertEq(token.balanceOf(address(registry)), 50e18);
    }

    function test_reward_paysFromPool() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 100e18);
        // seed the pool
        token.mint(owner, 1_000e18);
        token.approve(address(registry), 1_000e18);
        registry.fundRewards(1_000e18);

        // 3 upvotes
        vm.prank(bob);     registry.vote(0, true);
        vm.prank(carol);   registry.vote(0, true);
        vm.prank(treasury); registry.vote(0, true);

        uint256 aliceBefore = token.balanceOf(alice);
        registry.rewardReview(0);
        // reviewer gets their original stake back + 70% reward
        // 100e18 (refund of stake? no — the stake stays locked, reward is from pool)
        // reward = 100e18 * 7000 / 10000 = 70e18
        assertEq(token.balanceOf(alice) - aliceBefore, 70e18);
    }

    function test_reward_failsWhenPoolEmpty() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 100e18);
        vm.prank(bob); registry.vote(0, true);
        vm.expectRevert(bytes("pool empty"));
        registry.rewardReview(0);
    }

    function test_reward_failsWithoutMajority() public {
        _submit(alice, "playwright", QuiverReview.Grade.A, 100e18);
        token.mint(owner, 1_000e18);
        token.approve(address(registry), 1_000e18);
        registry.fundRewards(1_000e18);
        vm.prank(bob); registry.vote(0, false);

        vm.expectRevert(bytes("no majority"));
        registry.rewardReview(0);
    }

    // ── boost ─────────────────────────────────────────────────────

    function test_boost_createsActiveSlot() public {
        token.mint(alice, 1_000e18);
        vm.startPrank(alice);
        token.approve(address(registry), 1_000e18);
        registry.boost("playwright", 200e18, 7 days);
        vm.stopPrank();

        (address builder, uint256 amount, uint64 endsAt, bool active) =
            registry.getBoost("playwright");
        assertEq(builder, alice);
        assertEq(amount, 200e18);
        assertTrue(active);
        assertEq(endsAt, block.timestamp + 7 days);
    }

    function test_boost_overwritesPrevious() public {
        token.mint(alice, 1_000e18);
        token.mint(bob,   1_000e18);
        vm.startPrank(alice);
        token.approve(address(registry), 1_000e18);
        registry.boost("playwright", 200e18, 3 days);
        vm.stopPrank();

        vm.startPrank(bob);
        token.approve(address(registry), 1_000e18);
        registry.boost("playwright", 500e18, 5 days);
        vm.stopPrank();

        (, uint256 amount,,) = registry.getBoost("playwright");
        assertEq(amount, 500e18, "bob's boost overwrites alice's");
    }

    // ── helper ────────────────────────────────────────────────────

    function _submit(address user, string memory slug, QuiverReview.Grade g, uint256 amt) internal {
        token.mint(user, amt);
        vm.startPrank(user);
        token.approve(address(registry), amt);
        registry.submitReview(slug, g, amt);
        vm.stopPrank();
    }
}
