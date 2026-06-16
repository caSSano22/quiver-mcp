import { NextResponse } from 'next/server';
import { getFeed } from '@/lib/store';

export async function GET() {
  const feed = await getFeed();
  // pad with a few seeded entries so the homepage looks alive on first load
  const seed = [
    { who: '@jesse', action: 'submitted', what: 'Bankr MCP', kind: 'submit' },
    { who: '@aaronjmars', action: 'verified', what: 'Aeon runtime', kind: 'verify' },
    { who: '@mac_eth', action: 'staked', what: '12,400 $QUIVER', kind: 'stake' },
    { who: '@rootedge', action: 'reviewed', what: 'Context7', kind: 'review', grade: 'D' },
    { who: '@notionhq', action: 'claimed', what: 'Notion MCP listing', kind: 'claim' },
    { who: '@web3auth', action: 'submitted', what: 'Web3Auth MCP', kind: 'submit' },
    { who: '@playwright', action: 'updated', what: 'to latest', kind: 'update' },
    { who: '@coinbase', action: 'fixed', what: 'C-02 from grade B', kind: 'fix' },
    { who: '@brave', action: 'earned', what: '8,200 $QUIVER', kind: 'earn' },
  ];
  const out = feed.length ? feed : seed.map((s, i) => ({ ts: Date.now() - i * 60000, ...s }));
  return NextResponse.json({ ok: true, feed: out.slice(0, 30) });
}
