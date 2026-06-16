import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { McpCard } from '@/components/McpCard';
import { fetchMCPs } from '@/lib/fetch-mcps';

export const revalidate = 3600;

export const metadata = {
  title: 'Directory · Quiver',
  description: 'Browse every MCP server we index — real packages from npm.',
};

export default async function Directory({ searchParams }) {
  const cat = searchParams?.cat || 'all';
  const q = (searchParams?.q || '').toLowerCase();

  const all = await fetchMCPs();
  const filtered = all
    .filter((m) => (cat === 'all' ? true : m.category === cat))
    .filter((m) =>
      q
        ? (m.name + ' ' + m.description + ' ' + (m.tags || []).join(' '))
            .toLowerCase()
            .includes(q)
        : true
    )
    .sort((a, b) => b.installs - a.installs);

  const categories = [
    { slug: 'all', label: 'All' },
    ...Array.from(new Set(all.map((m) => m.category)))
      .sort()
      .map((slug) => ({ slug, label: slug[0].toUpperCase() + slug.slice(1) })),
  ];

  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-mono text-brand-400">// directory</div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              {filtered.length} MCPs
              {cat !== 'all' && <span className="ml-2 text-base font-normal text-white/40">in {cat}</span>}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Live index of MCP packages from npm. Grade, install count, and a
              public evidence bundle.
            </p>
          </div>
          <form className="flex w-full max-w-sm gap-2" action="/directory">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="search MCPs, tags, packages…"
              className="w-full rounded-full border border-white/10 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
            />
            {cat !== 'all' && <input type="hidden" name="cat" value={cat} />}
            <button type="submit" className="btn-primary !py-2.5">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c.slug === cat;
            const href = q
              ? `/directory?cat=${c.slug}&q=${encodeURIComponent(q)}`
              : `/directory?cat=${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={href}
                className={
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition ' +
                  (active
                    ? 'border-brand/40 bg-brand/10 text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.06]')
                }
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <McpCard key={m.slug} mcp={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-white/50">
            No MCPs match. Try another search or{' '}
            <Link href="/submit" className="text-brand-400 hover:text-white">
              submit one
            </Link>
            .
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
