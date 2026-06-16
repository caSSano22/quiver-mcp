# Quiver

> The directory for AI agent tools. Discover, review, and rate MCP servers powering the agent economy.

A public, evidence-first index of every MCP server on npm — with a public letter grade (A–F) and a community review thread for each one.

**Live:** https://quiver-xi.vercel.app
**Status:** pre-launch · directory is real, token is not

---

## What this is

MCP servers are how agents reach the outside world — browsers, wallets, databases, files, search. There are thousands of them, most are not independently tested, and a small number are actively malicious (tool-output injection, permission overreach, data exfiltration).

Quiver is three things in one stack:

1. **Directory** — every MCP package on npm, with live install counts and a real search/filter.
2. **Polygraph** — a public letter grade (A–F) per server, based on a sandboxed adversarial probe of its tool surface.
3. **Reviews** — a public review thread for every server. Reviewers build reputation over time; the directory learns which voices to trust.

## What's not here

There is **no token**, **no staking**, **no on-chain claim**. The `/token` page says "Not launched." and that's the truth. If a token ever ships, this README will get a new section.

## Stack

- **Frontend:** Next.js 14 (App Router), React 18, plain CSS (no Tailwind).
- **Data:** live npm registry (`https://registry.npmjs.org/-/v1/search?text=model+context+protocol`), hourly ISR revalidation.
- **Storage:** in-memory for reviews / submissions / activity. Resets on Vercel cold start. Drop-in Vercel KV support is wired up — see `lib/store.js`.
- **Wallet:** native `window.ethereum` (MetaMask / Rabby). No RainbowKit, no WalletConnect, no third-party SDKs.
- **No on-chain code.** No contracts. No Foundry. No deploy scripts.

## Local development

```bash
git clone https://github.com/caSSano22/quiver-mcp
cd quiver-mcp
npm install
npm run dev
# → http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## API

A small REST surface, all keyless on reads:

| Method | Path                          | Description                                   |
|--------|-------------------------------|-----------------------------------------------|
| GET    | `/api/mcps`                   | List every indexed MCP                        |
| GET    | `/api/mcps/:slug`             | One MCP + grade + fingerprint                 |
| GET    | `/api/mcps/:slug/evidence`    | Full polygraph evidence bundle                |
| GET    | `/api/leaderboard`            | Reputation-weighted top MCPs                  |
| GET    | `/api/feed`                   | Live activity feed                            |
| POST   | `/api/mcps/:slug/reviews`     | Submit a public review                        |
| GET    | `/api/categories`             | Category list                                 |

Example:

```bash
curl https://quiver-xi.vercel.app/api/mcps/context7
```

## Repo layout

```
app/                  # Next.js App Router
  page.js             # Homepage
  directory/          # Browse + filter MCPs
  mcp/[slug]/         # One MCP + reviews
  leaderboard/        # Top MCPs
  submit/             # Submit-a-MCP form
  token/              # "Not launched" stub
  x/                  # X timeline
  docs/               # API + CLI docs
  api/                # JSON endpoints
components/           # React components
  Header / Footer / McpCard / LiveFeed / ReviewForm / ConnectButton / Logo / Stat
lib/
  data.js             # Seed MCPs (12 hardcoded + npm on top)
  fetch-mcps.js       # Live npm registry fetch + merge
  store.js            # In-memory + Vercel KV abstraction
public/               # Brand assets
```

## Submitting an MCP

Drop into `/submit`, paste the npm package or HTTP URL, and the queue takes it from there. New submissions get indexed within the hour.

## Contributing

Issues and PRs are open. Two ways to help:

1. **Add a polygraph probe.** New probe → new line of defense against malicious MCPs. The grade matrix lives in `app/mcp/[slug]/page.js` (C-01 through C-03 today).
2. **Seed reviews.** Pick an MCP, install it, write a real review. Builds the directory's trust signal.

## License

MIT.

---

Built by Anonnux · no team · no funding · just a directory the agent stack already needed.
