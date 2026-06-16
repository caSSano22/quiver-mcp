# QuiverReview — the directory's incentive layer

Solidity smart contract that powers the stake-weighted review + boost market
on top of the $QUIVER token (deployed separately via Bankr on Base).

## What it does

- **Stake-to-review.** Reviewers lock $QUIVER behind a take on an MCP.
- **Vote.** Community upvotes/downvotes. Self-votes are rejected.
- **Reward.** Upvoted reviews get paid out from a rewards pool (70% of stake).
- **Slash.** Caught-shilling reviews are slashed — 50% burned, 50% to treasury.
- **Boost.** Builders stake to feature their MCP on the directory's homepage.

## Spec

| Field | Value |
|---|---|
| Solidity | 0.8.20 |
| License | MIT |
| Dependencies | OpenZeppelin v5.0.2 (`IERC20`, `SafeERC20`, `Ownable`, `ReentrancyGuard`) |
| Bytecode | 7,498 B (well under 24,576 B EIP-170 limit) |
| Optimizer | enabled, 200 runs |
| Tests | 10/10 passing |

## Constants

| Constant | Value | Meaning |
|---|---|---|
| `MIN_STAKE` | 1 $QUIVER | minimum stake behind any review |
| `MIN_BOOST` | 100 $QUIVER | minimum to feature an MCP |
| `MAX_BOOST_DURATION` | 30 days | longest a boost slot can run |
| `SLASH_BPS` | 5,000 (50%) | burned on caught shilling |
| `REWARD_BPS` | 7,000 (70%) | of stake paid from rewards pool |

## Tests

```bash
forge test -vv
```

10 tests cover: submit (min check, stake flow), vote (counters, self-vote block),
slash (treasury, burn), reward (majority, pool empty), boost (active slot,
overwrite).

## Deploy to Base mainnet

Once $QUIVER is live via Bankr:

```bash
cd contracts
QUIVER=0x<quiver_token_address>   \
TREASURY=0x<your_treasury>        \
PRIVATE_KEY=0x<your_pk>           \
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://mainnet.base.org \
  --broadcast --verify
```

## Deploy to Base Sepolia (test first)

```bash
QUIVER=0x...   TREASURY=0x...   PRIVATE_KEY=0x...   \
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://sepolia.base.org --broadcast
```

## Layout

```
src/QuiverReview.sol      ← the contract
test/QuiverReview.t.sol   ← 10 tests
script/Deploy.s.sol       ← mainnet + sepolia deploy
lib/openzeppelin-contracts ← OZ v5.0.2
lib/forge-std             ← testing framework
```
