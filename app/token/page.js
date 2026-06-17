import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { token } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: '$QUIVER · tokenomics · Quiver',
  description:
    '$QUIVER is live on Base via Virtuals Protocol. Stake to review, earn when the community agrees.',
};

const CA = '0x5e2d60835011c14a978bc958d6ec31dccc440770';
const BASESCAN = `https://basescan.org/address/${CA}`;
const VIRTUALS = 'https://app.virtuals.io';

export default function TokenPage() {
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-mono text-brand-400">// the token</div>
            <h1 className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
              $QUIVER
            </h1>
            <p className="mt-3 max-w-md text-white/65">
              The incentive layer of the directory. Stake to review, earn when
              you&rsquo;re right, get slashed when you shill.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-white/40">Chain</dt>
                <dd className="mt-1 font-display text-lg text-white">Base</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-white/40">Supply</dt>
                <dd className="mt-1 font-display text-lg text-white">1B $QUIVER</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-white/40">Decimals</dt>
                <dd className="mt-1 font-display text-lg text-white">18</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-white/40">Launched</dt>
                <dd className="mt-1 font-display text-lg text-white">{token.launched}</dd>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-[10px] uppercase tracking-wider text-white/40">CA</dt>
                <dd className="mt-1 font-mono text-sm text-white/85 break-all">
                  <a href={BASESCAN} target="_blank" rel="noreferrer" className="hover:text-brand-400">
                    {CA}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={VIRTUALS} target="_blank" rel="noreferrer" className="btn-primary">
                Trade on Virtuals →
              </a>
              <a href={BASESCAN} target="_blank" rel="noreferrer" className="btn-ghost">
                Basescan
              </a>
            </div>
            <p className="mt-3 text-xs text-white/40">
              Initial pair lives on Virtuals Protocol. Live market stats (FDV / liquidity / holders)
              populate on-chain once trading begins — check Virtuals for the latest numbers.
            </p>
          </div>

          {/* Distribution */}
          <div>
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-white">Distribution</h3>
              <p className="mt-1 text-sm text-white/55">Where the 1B supply lands.</p>
              <div className="mt-5 space-y-3">
                {[
                  ['Community + rewards', token.pct.community, 'bg-brand'],
                  ['Treasury', token.pct.treasury, 'bg-accent-mint'],
                  ['Team (4y vest, 1y cliff)', token.pct.team, 'bg-accent-pink'],
                  ['Initial liquidity', token.pct.liquidity, 'bg-white/40'],
                  ['Advisors', token.pct.advisors, 'bg-white/20'],
                ].map(([label, pct, color]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/75">{label}</span>
                      <span className="font-mono text-white/55">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mt-4">
              <h3 className="font-display text-lg font-semibold text-white">What $QUIVER does</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-brand-400">·</span>
                  <span><b className="text-white">Stake-to-review.</b> Lock $QUIVER behind a review; if the community upvotes it, you earn from the rewards pool.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-400">·</span>
                  <span><b className="text-white">Boost.</b> Builders stake $QUIVER to feature their MCP on the directory&rsquo;s homepage.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-400">·</span>
                  <span><b className="text-white">Slash.</b> Caught shilling burns your stake. The directory gets sharper over time.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-400">·</span>
                  <span><b className="text-white">API access.</b> Heavy users pay $QUIVER per call to the indexed-data API.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold gradient-text">
            Fair launch via Virtuals Protocol.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/65">
            60% to the community from day one. 18% to the treasury, governed by
            holders via onchain vote. Team is locked 4 years, 1-year cliff.
            Initial liquidity on Virtuals Protocol, with LP tokens locked.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/55">
            Contract source: minimal proxy (EIP-1167) over a verified implementation. All
            transactions verifiable on Basescan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={VIRTUALS} target="_blank" rel="noreferrer" className="btn-primary">
              Trade on Virtuals →
            </a>
            <Link href="/docs#token" className="btn-ghost">Read the spec</Link>
            <a href={BASESCAN} target="_blank" rel="noreferrer" className="btn-ghost">Basescan</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
