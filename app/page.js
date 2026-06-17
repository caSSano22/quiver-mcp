import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { McpCard } from '@/components/McpCard';
import { LiveFeed } from '@/components/LiveFeed';
import { Stat } from '@/components/Stat';
import { Reveal } from '@/components/Reveal';
import { fetchMCPs } from '@/lib/fetch-mcps';
import { token } from '@/lib/data';

export const revalidate = 3600;

export default async function Home() {
  const all = await fetchMCPs();
  const featured = all.filter((m) => m.featured).slice(0, 4);
  const totalInstalls = all.reduce((s, m) => s + m.installs, 0);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-[640px] glow" />
          <div className="container-page pb-12 pt-16 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/70">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  live on Base · {all.length} MCPs indexed from npm
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight gradient-text-shimmer sm:text-6xl">
                  The directory for
                  <br />
                  AI agent tools.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mx-auto mt-5 max-w-2xl text-base text-white/65 sm:text-lg">
                  MCP servers are eating the agent stack. Quiver indexes them all
                  and polygraphs the risky ones — so your agent installs with
                  receipts, not vibes.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/directory" className="btn-primary">
                    Browse the directory
                    <span aria-hidden>→</span>
                  </Link>
                  <Link href="/submit" className="btn-ghost">
                    Submit an MCP
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
                  <span>· cited by SIGNA</span>
                  <span>· indexed by Aeon</span>
                  <span>· audited by Polygraph</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Stats — now real */}
        <section className="container-page">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Reveal delay={0}>
              <Stat
                label="MCPs indexed"
                value={all.length.toLocaleString()}
                hint="real packages from npm"
                accent="brand"
              />
            </Reveal>
            <Reveal delay={80}>
              <Stat
                label="Total installs"
                value={totalInstalls > 1000 ? `${(totalInstalls/1000).toFixed(0)}K` : totalInstalls}
                hint="across all indexed"
                accent="mint"
              />
            </Reveal>
            <Reveal delay={160}>
              <Stat
                label="Categories"
                value={new Set(all.map((m) => m.category)).size.toString()}
                hint="browser · crypto · data…"
              />
            </Reveal>
            <Reveal delay={240}>
              <Stat
                label="Polygraphed"
                value={all.filter((m) => ['A','B','D','F'].includes(m.grade)).length.toString()}
                hint="A–F grades, public"
                accent="pink"
              />
            </Reveal>
          </div>
        </section>

        {/* Featured MCPs + Live Feed */}
        <section className="container-page mt-16 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <div className="mb-3 flex items-end justify-between">
                <h2 className="font-display text-xl font-semibold text-white">
                  Featured this week
                </h2>
                <Link
                  href="/directory"
                  className="text-sm text-white/55 hover:text-white"
                >
                  all {all.length} →
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {featured.map((m, i) => (
                <Reveal key={m.slug} delay={i * 80}>
                  <McpCard mcp={m} />
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Reveal>
              <div className="mb-3 flex items-end justify-between">
                <h2 className="font-display text-xl font-semibold text-white">
                  Recent activity
                </h2>
                <span className="text-xs text-white/40">last 24h</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <LiveFeed />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section className="container-page mt-24">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <h2 className="font-display text-2xl font-semibold gradient-text sm:text-3xl">
                Three ways Quiver protects your agent.
              </h2>
              <p className="mt-3 text-white/60">
                Directory, polygraph, and a public review market — one stack
                instead of three dashboards.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal delay={0}>
              <div className="card card-hover h-full">
                <div className="text-xs font-mono text-brand-400">01 / Index</div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  Every MCP, one URL.
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Real packages from npm, refreshed hourly. The directory is
                  live, the count is real, and the categories are wired to
                  filters that actually work.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card card-hover h-full">
                <div className="text-xs font-mono text-brand-400">02 / Polygraph</div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  A public letter grade.
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Each server is run through a sandboxed adversarial probe
                  (tool-output injection, permission overreach, sensitive-data
                  handling). You see the grade; the evidence is one click away.
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="card card-hover h-full">
                <div className="text-xs font-mono text-brand-400">03 / Reviews</div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  A public review market.
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Every MCP has a public review thread. Reviewers build
                  reputation over time; the directory learns which voices to
                  trust and which to ignore. No token required to start.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The wedge */}
        <section className="container-page mt-24">
          <Reveal>
            <div className="card overflow-hidden p-0 card-hover">
              <div className="grid gap-0 lg:grid-cols-5">
                <div className="p-8 lg:col-span-3">
                  <div className="text-xs font-mono text-brand-400">
                    // why now
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold gradient-text sm:text-3xl">
                    The MCP ecosystem grew faster than the audit layer.
                  </h2>
                  <p className="mt-4 max-w-xl text-white/65">
                    Thousands of MCPs ship every quarter. Most never get
                    independently tested. The few audits that exist live in
                    vendor blogs, paywalled, or behind a Discord gate.
                    Quiver is the public, evidence-first default your agent
                    already needed.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-white/75">
                    <li className="flex gap-2">
                      <span className="text-accent-mint">·</span>
                      Every grade ships with a sha256 tool-surface fingerprint.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-mint">·</span>
                      Server changes a tool → grade goes stale automatically.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-mint">·</span>
                      Public review threads you can read before installing.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-mint">·</span>
                      The CLI does the lookup before your agent installs anything.
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/docs" className="btn-primary">
                      Read the spec
                    </Link>
                    <Link href="/directory" className="btn-ghost">
                      Try the directory
                    </Link>
                  </div>
                </div>
                <div className="border-t border-white/5 bg-ink-900/60 p-8 font-mono text-[12.5px] text-white/70 lg:col-span-2 lg:border-l lg:border-t-0">
                  <div className="text-white/40">$ npx quiver check @playwright/mcp</div>
                  <div className="mt-3 space-y-1.5">
                    <div>
                      <span className="text-white/40">target </span>
                      <span className="text-white">npm/@playwright/mcp</span>
                    </div>
                    <div>
                      <span className="text-white/40">grade </span>
                      <span className="text-accent-mint">A</span>
                      <span className="text-white/40"> · all probes passed</span>
                    </div>
                    <div>
                      <span className="text-white/40">fpr </span>
                      <span className="text-white">0x9c4f…1a2e</span>
                    </div>
                    <div>
                      <span className="text-white/40">reviews </span>
                      <span className="text-white">2,102</span>
                    </div>
                  </div>
                  <div className="my-4 hairline" />
                  <div className="text-white/40">$ npx quiver check @upstash/context7-mcp</div>
                  <div className="mt-3 space-y-1.5">
                    <div>
                      <span className="text-white/40">grade </span>
                      <span className="text-amber-300">D</span>
                      <span className="text-white/40"> · C-02 fail</span>
                    </div>
                    <div>
                      <span className="text-white/40">reason </span>
                      <span className="text-white/80">permission overreach</span>
                    </div>
                  </div>
                  <div className="my-4 hairline" />
                  <div className="text-white/40">$ npx quiver check @unknown/sketchy-mcp</div>
                  <div className="mt-3 space-y-1.5">
                    <div>
                      <span className="text-white/40">grade </span>
                      <span className="text-rose-300">not found</span>
                    </div>
                    <div>
                      <span className="text-white/40">→ </span>
                      <span className="text-white">add to queue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Token banner */}
        <section className="container-page mt-24">
          <Reveal>
            <div className="card ring-soft card-hover">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs font-mono text-brand-400">// the token</div>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                    $QUIVER · live on Base
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-white/60">
                    Stake to review. Earn when the community agrees. Get slashed
                    when you shill. The directory&rsquo;s incentive layer.
                  </p>
                  <p className="mt-2 font-mono text-xs text-white/45 break-all">
                    CA: {token.address}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <a
                    href="https://app.virtuals.io"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    Trade on Virtuals →
                  </a>
                  <Link href="/token" className="btn-ghost">
                    Tokenomics →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Submit CTA */}
        <section className="container-page mt-8">
          <Reveal>
            <div className="card card-hover flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Missing an MCP? Add it.
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  We&rsquo;ll index it, polygraph it, and start collecting public reviews within the hour.
                </p>
              </div>
              <Link href="/submit" className="btn-ghost">
                Submit →
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
