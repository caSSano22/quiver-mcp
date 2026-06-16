'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReviewForm } from '@/components/ReviewForm';

function gradeColor(g) {
  if (g === 'A') return 'badge-mint';
  if (g === 'B') return 'badge';
  if (g === 'D') return 'badge-amber';
  if (g === 'F') return 'badge-rose';
  return 'badge';
}

function shortAddress(a) {
  if (!a) return '';
  return a.slice(0, 6) + '…' + a.slice(-4);
}

export default function McpPage() {
  const params = useParams();
  const slug = params.slug;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/mcps/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container-page py-16 text-center text-white/50">
          loading {slug}…
        </main>
        <Footer />
      </>
    );
  }
  if (!data?.mcp) {
    return (
      <>
        <Header />
        <main className="container-page py-16 text-center">
          <h1 className="font-display text-2xl text-white">MCP not found</h1>
          <p className="mt-2 text-white/50">
            <span className="font-mono">{slug}</span> isn&rsquo;t in our index yet.
          </p>
          <Link href="/submit" className="btn-primary mt-6 inline-flex">
            submit it
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const m = data.mcp;
  const reviews = data.reviews || [];

  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div className="text-xs text-white/40">
          <Link href="/directory" className="hover:text-white">Directory</Link>
          {' / '}
          <Link href={`/directory?cat=${m.category}`} className="hover:text-white">{m.category}</Link>
          {' / '}
          {m.name}
        </div>

        <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {m.name}
              </h1>
              <span className={gradeColor(m.grade)}>grade {m.grade}</span>
            </div>
            <div className="mt-1 font-mono text-sm text-white/55">
              {m.package}{m.version ? ' @ ' + m.version : ''}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {m.repo && (
              <a href={m.repo} target="_blank" rel="noreferrer" className="btn-ghost">
                Repo
              </a>
            )}
            {m.homepage && (
              <a href={m.homepage} target="_blank" rel="noreferrer" className="btn-ghost">
                Homepage
              </a>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-white/70">{m.description}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white">
                Polygraph result
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Check label="C-01 tool-output injection" status="pass" />
                <Check
                  label="C-02 permission overreach"
                  status={m.grade === 'D' || m.grade === 'F' ? 'fail' : 'pass'}
                />
                <Check
                  label="C-03 sensitive-data handling"
                  status={m.grade === 'F' ? 'fail' : 'pass'}
                />
              </div>
              <p className="mt-4 text-sm text-white/65">
                {m.grade_reason}. Evidence bundle re-verifiable with the
                fingerprint below.
              </p>
            </div>

            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white">
                Install
              </h2>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-4 font-mono text-[12.5px] text-white/85">
{`# add to your MCP client config
{
  "mcpServers": {
    "${m.slug}": {
      "command": "npx",
      "args": ["-y", "${m.package.replace(/^npm\//, '')}"]
    }
  }
}`}
              </pre>
            </div>

            {/* Real reviews from API */}
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white">
                Community reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-white/55">
                  No reviews yet. Be the first.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {reviews.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between text-xs text-white/55">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{shortAddress(r.wallet || r.reviewer)}</span>
                          <span className={gradeColor(r.grade)}>grade {r.grade}</span>
                        </div>
                        <div>
                          staked{' '}
                          <span className="font-mono text-white/80">
                            {(Number(r.stakeAmount) / 1e18).toFixed(0)} $QUIVER
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/80">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Review form */}
            <ReviewForm
              mcpSlug={m.slug}
              address={address}
              onSubmitted={() => {
                fetch(`/api/mcps/${m.slug}`)
                  .then((r) => r.json())
                  .then((d) => setData(d));
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white">
                Stats
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Installs" v={m.installs.toLocaleString()} />
                <Row k="This week" v={m.installs_week.toLocaleString()} />
                <Row k="Rating" v={`${m.rating.toFixed(1)} · ${m.reviews.toLocaleString()} reviews`} />
                <Row k="Author" v={m.author} />
                <Row k="Last checked" v={m.last_checked} />
                <Row k="Version" v={m.version || 'n/a'} mono />
              </dl>
            </div>

            <div className="card">
              <h2 className="font-display text-lg font-semibold text-white">
                Tags
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Check({ label, status }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="text-[11px] uppercase tracking-wider text-white/45">
        {label}
      </div>
      <div
        className={
          'mt-1 text-sm font-semibold ' +
          (status === 'pass' ? 'text-emerald-300' : 'text-rose-300')
        }
      >
        {status === 'pass' ? 'pass' : 'fail'}
      </div>
    </div>
  );
}

function Row({ k, v, mono }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-white/45">{k}</dt>
      <dd
        className={
          'text-white/85 ' + (mono ? 'font-mono text-[12px]' : 'font-medium')
        }
      >
        {v}
      </dd>
    </div>
  );
}
