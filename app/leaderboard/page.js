import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchMCPs } from '@/lib/fetch-mcps';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Leaderboard · Quiver',
  description: 'Top-rated MCPs by stake-weighted community review.',
};

export default async function Leaderboard() {
  const mcps = await fetchMCPs();
  const ranked = [...mcps].sort(
    (a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1)
  );
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div>
          <div className="text-xs font-mono text-brand-400">// leaderboard</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
            Stake-weighted top MCPs
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Rating × log(reviews). The ones the community has actually put
            money behind.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">MCP</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Rating</th>
                <th className="px-4 py-3 text-right">Reviews</th>
                <th className="px-4 py-3 text-right">Installs</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {ranked.map((m, i) => (
                <tr key={m.slug} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/mcp/${m.slug}`}
                      className="font-display text-white hover:text-brand-400"
                    >
                      {m.name}
                    </Link>
                    <div className="text-[11px] text-white/40">{m.package}</div>
                  </td>
                  <td className="px-4 py-3 text-white/65">{m.category}</td>
                  <td className="px-4 py-3 text-right text-white">
                    {m.rating.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/65">
                    {m.reviews.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-white/65">
                    {m.installs.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.grade === 'A'
                          ? 'badge-mint'
                          : m.grade === 'B'
                          ? 'badge'
                          : m.grade === 'D'
                          ? 'badge-amber'
                          : 'badge-rose'
                      }
                    >
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
