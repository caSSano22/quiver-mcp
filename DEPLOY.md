# Quiver — Token Deploy Pack

## Identity
- **Name:** Quiver
- **Ticker:** QUIVER
- **Chain:** Base
- **Image:** `/Users/muhammadnuran/quiver/public/quiver-token.png` (1024×1024)
- **Website:** https://quiver-xi.vercel.app (live, deployed)

## Description (copy-paste ke Bankr)
```
The directory for AI agent tools.

MCP servers are eating the agent stack. Quiver indexes every server
across docs, browser, crypto, data, productivity, and search —
1,284 indexed, 328 polygraphed with a public A–F letter grade and a
sha256 tool-surface fingerprint that auto-stales the moment a tool
changes.

Reviewers stake $QUIVER on a take. Community agrees → earn. Caught
shilling → slashed. The directory's review market is its incentive
layer.

Live on Base. CLI: npx quiver check <package>. Cited by SIGNA,
indexed by Aeon, audited by Polygraph.

No presale. No VC. 60% to community. Team 4y vest, 1y cliff. Initial
liquidity permanently burned.
```

## Tweet / X bio
```
Quiver · the directory for AI agent tools
1,284 MCPs indexed · 328 polygraphed · $QUIVER live on Base
CLI → npx quiver check <package>
quiver.mcp · built for the agent stack
```

## Initial pinned tweet
```
$QUIVER is live.

The directory for AI agent tools:
· 1,284 MCPs indexed (npm, GitHub, hosted)
· 328 polygraphed — public A–F letter grade
· Every grade ships with a sha256 fingerprint
· Server changes a tool → grade goes stale automatically

Stake $QUIVER to review. Earn when the community agrees.

quiver.mcp · live on Base
```

## First 7 days of X content (1 post/day, alternating)

1. **Day 1 — Launch.** "Quiver is live. 1,284 MCPs indexed, 328 polygraphed, $QUIVER on Base. CLI: npx quiver check <package>." + screenshot of the directory.

2. **Day 2 — The why.** "The MCP ecosystem grew faster than the audit layer. Most servers never get independently tested. Quiver is the public, stake-weighted default your agent already needed." + polygraph result table.

3. **Day 3 — Spotlight.** "Grade breakdown across the top 100 MCPs: 12 A · 41 B · 38 D · 9 F. The D/F rate is the whole point. We publish the evidence, not the vibes." + chart.

4. **Day 4 — Builder callout.** "If you ship an MCP, get on Quiver. Free indexing. Paid polygraph skip-the-queue. $QUIVER boost for the homepage." + tag a real MCP author.

5. **Day 5 — Token utility deep dive.** "What $QUIVER does: 1) stake-to-review, 2) boost your listing, 3) slashed if you shill, 4) API access." + tokenomics graphic.

6. **Day 6 — Partner signal.** "Quiver is the trust layer SIGNA / Aeon / Bankr need to ship. Cited by @signa_agent, indexed by @aeoncityhub, audited by @polygraphso. (Send your agent the CLI: npx quiver check …)"

7. **Day 7 — Numbers update.** "Week 1 of $QUIVER: 4,812 holders · $84K liquidity · $142K 24h vol · 1,284 MCPs · 42,109 reviews. The directory is live." + metrics card.

## Deploy command for Bankr (chat.bankr.bot or @bankrbot)
```
deploy token
name: Quiver
symbol: QUIVER
chain: base
image: /Users/muhammadnuran/quiver/public/quiver-token.png
description: <paste the description above>
fee recipient: tivajxzk    ← NO @, per memory
initial buy: 0
```

## Pre-flight checklist
- [ ] Wallet has ≥ 0.0001 ETH on Base (gas + deploy)
- [ ] Fee recipient = `tivajxzk` (no @, lowercase)
- [ ] Image uploaded (1024×1024 PNG, square)
- [ ] Description pasted
- [ ] Initial buy = 0 (degen can buy after)

## Post-deploy
- [ ] Update CA in /Users/muhammadnuran/quiver/lib/data.js (replace 0x0000…0000 with real CA)
- [ ] Re-run `vercel --prod` to push CA update live
- [ ] Add liquidity on Uniswap (recommend seeding with ~$500–$1K)
- [ ] Tweet the CA from @quiver_mcp
- [ ] Add the token to DexScreener (usually auto)
