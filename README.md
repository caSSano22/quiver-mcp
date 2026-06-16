# Quiver

> The directory for AI agent tools. Discover, review, and rate MCP servers powering the agent economy.

**Live:** [quiver-xi.vercel.app](https://quiver-xi.vercel.app)
**Token:** `$QUIVER` on Base
**Smart contract:** `QuiverReview.sol` (this repo, `contracts/`)

---

## What is Quiver?

The MCP ecosystem grew faster than the audit layer. Most servers never get independently tested. Quiver is the public, stake-weighted, onchain-anchored default your agent already needed.

- **Index** — every MCP, one URL. Real packages from npm, refreshed hourly.
- **Polygraph** — public letter grade (A–F) with adversarial probes (tool-output injection, permission overreach, sensitive-data handling).
- **Stake** — reviewers lock `$QUIVER` behind a take; community votes; shills get slashed.

## Stack

| Layer | Tech |
|---|---|
| Site | Next.js 14 (App Router) · TailwindCSS · dark SaaS |
| Data | Live fetch from npm registry (`registry.npmjs.org`) |
| Backend | Next.js API routes · in-memory store (auto-upgrades to Vercel KV) |
| Wallet | `window.ethereum` · Base chain detection · EIP-191 |
| X | `platform.twitter.com/widgets.js` timeline embed (no API key) |
| Smart contract | Solidity 0.8.20 · OpenZeppelin v5.0.2 · Foundry |
| Deploy | Vercel (auto) · Base mainnet (manual) |

## Repo layout

```
app/                  Next.js pages
  ├── page.js         home (hero, featured, live feed, token banner)
  ├── directory/      browse all MCPs (real npm data)
  ├── mcp/[slug]/     MCP detail with stake-weighted review form
  ├── leaderboard/    stake-weighted top MCPs
  ├── token/          $QUIVER tokenomics
  ├── x/              @quiver_mcp live timeline
  ├── docs/           quickstart, CLI, API, polygraph spec
  ├── submit/         submit-an-MCP form (POSTs to /api/submissions)
  └── api/            4 serverless routes (mcps, reviews, submissions, feed)

components/           Header (with wallet connect) · Footer · McpCard
                      · LiveFeed · Stat · Logo · ConnectButton · ReviewForm

lib/
  ├── fetch-mcps.js   npm registry fetcher with smart slug/display-name mapping
  ├── store.js        in-memory persistence (auto Vercel KV upgrade)
  └── data.js         token stats, feed seeds

contracts/
  ├── src/QuiverReview.sol   stake-weighted review + boost market
  ├── test/                  10/10 tests (forge test)
  ├── script/Deploy.s.sol    mainnet + sepolia deploy
  └── README.md              full spec

public/               logos, favicon, token image
DEPLOY.md             Bankr deploy pack + 7-day X content plan
```

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Test the smart contract

```bash
cd contracts
forge test -vv
# 10 passed; 0 failed
```

## Deploy the site

```bash
npx vercel --yes --prod
```

## Deploy the contract

```bash
cd contracts
QUIVER=0x<quiver_token>   TREASURY=0x<your_treasury>   PRIVATE_KEY=0x<your_pk>   \
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://mainnet.base.org --broadcast --verify
```

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/mcps` | list real MCPs from npm (filter by `?cat=…&q=…`) |
| `GET` | `/api/mcps/[slug]` | one MCP + its reviews |
| `GET` | `/api/mcps/[slug]/reviews` | reviews for one MCP |
| `POST` | `/api/mcps/[slug]/reviews` | submit a stake-weighted review |
| `GET` | `/api/feed` | live activity (auto-seeded when empty) |
| `POST` | `/api/submissions` | submit a new MCP for indexing |

All POSTs are server-side validated. Wallets are recorded for off-chain
verification until the on-chain contract is wired in.

## Token utility ($QUIVER)

| Action | $QUIVER |
|---|---|
| Submit a review (min 1) | stake, locked |
| Boost an MCP listing (min 100) | stake, locked up to 30 days |
| Vote on a review | free |
| Earn from an upvoted review | +70% of stake from the rewards pool |
| Get caught shilling | -50% of stake (50% burned, 50% to treasury) |
| Heavy API use | pay per call in $QUIVER |

## Roadmap

- [x] Live site + real MCP data
- [x] Wallet connect + stake-weighted review form
- [x] Smart contract (10/10 tests)
- [x] X timeline embed
- [ ] Token deploy via Bankr
- [ ] Contract deploy to Base
- [ ] CLI: `npx quiver check <package>` (published to npm)
- [ ] Real polygraph harness (sandboxed adversarial probes)
- [ ] Vercel KV for durable storage

## License

MIT — see [LICENSE](./LICENSE).

## Links

- **Site:** https://quiver-xi.vercel.app
- **X:** [@quiver_mcp](https://x.com/quiver_mcp)
- **Base:** $QUIVER on Base
- **Spec:** [DEPLOY.md](./DEPLOY.md)
- **Contract:** [contracts/README.md](./contracts/README.md)
