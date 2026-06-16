// /Users/muhammadnuran/quiver/app/x/page.js
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  title: '@quivermcp · X timeline · Quiver',
  description: 'Every polygraph drop, every review call-out, every builder thread — live from @quivermcp.',
};

export default function XPage() {
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="text-xs font-mono text-brand-400">// @quivermcp</div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              From the X timeline
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/65">
              Every polygraph drop, every review call-out, every builder thread —
              live from <a className="text-white hover:text-brand-400" href="https://x.com/quivermcp" target="_blank" rel="noreferrer">@quivermcp</a>.
            </p>

            {/* Twitter timeline embed — works without API key */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-1">
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-chrome="noheader nofooter transparent"
                data-height="900"
                href="https://x.com/quivermcp"
              >
                Loading @quivermcp…
              </a>
            </div>
            <Script
              src="https://platform.twitter.com/widgets.js"
              strategy="lazyOnload"
              async
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-white">
                Follow
              </h3>
              <p className="mt-1 text-sm text-white/55">
                Real-time drops. Polygraph results. Builder call-outs.
              </p>
              <a
                href="https://x.com/quivermcp"
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 w-full justify-center"
              >
                @quivermcp →
              </a>
            </div>

            <div className="card">
              <h3 className="font-display text-lg font-semibold text-white">
                On this page
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>· Latest polygraph drops</li>
                <li>· Reviewer call-outs</li>
                <li>· Builder launches</li>
                <li>· Directory updates</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="font-display text-lg font-semibold text-white">
                Posting cadence
              </h3>
              <p className="mt-2 text-sm text-white/65">
                1 post / day, alternating between polygraph results, builder
                spotlights, and reviewer call-outs.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
