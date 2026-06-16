import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Docs · Quiver',
  description: 'How to query the Quiver directory, CLI, and API.',
};

export default function Docs() {
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <nav className="space-y-1 text-sm">
              {[
                ['Quickstart', '#quickstart'],
                ['CLI', '#cli'],
                ['API', '#api'],
                ['Polygraph', '#polygraph'],
                ['Token', '#token'],
                ['Security', '#security'],
              ].map(([l, h]) => (
                <a
                  key={h}
                  href={h}
                  className="block rounded px-2 py-1.5 text-white/55 hover:bg-white/5 hover:text-white"
                >
                  {l}
                </a>
              ))}
            </nav>
          </aside>

          <article className="prose-invert max-w-none">
            <div className="text-xs font-mono text-brand-400">// docs</div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              The Quiver docs
            </h1>
            <p className="mt-2 text-white/65">
              How to query the directory, run the polygraph locally, and use
              the API.
            </p>

            <section id="quickstart" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">Quickstart</h2>
              <p className="mt-2 text-sm text-white/65">
                60 seconds from npm to a graded MCP.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-4 font-mono text-[12.5px] text-white/85">
{`# install the CLI
npm i -g quiver-cli

# look up a server
quiver check @playwright/mcp

# output
#   target  : npm/@playwright/mcp
#   grade   : A
#   fpr     : 0x9c4f…1a2e
#   reviews : 2,102
#   stake   : 48.2k $QUIVER`}
              </pre>
            </section>

            <section id="cli" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">CLI</h2>
              <p className="mt-2 text-sm text-white/65">
                Lookup an MCP, fetch its evidence bundle, and (optionally)
                install it.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-4 font-mono text-[12.5px] text-white/85">
{`quiver check <package-or-url>      # grade + fingerprint
quiver install <package>           # check + install (refuses if grade < C)
quiver review <package> --stake 50 # submit a stake-weighted review
quiver feed                        # live onchain activity`}
              </pre>
            </section>

            <section id="api" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">API</h2>
              <p className="mt-2 text-sm text-white/65">
                A single REST surface for the whole index. Keyless reads;
                signed writes.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-4 font-mono text-[12.5px] text-white/85">
{`GET    /api/mcps                    # list all indexed MCPs
GET    /api/mcps/:slug              # one MCP, with grade + fingerprint
GET    /api/mcps/:slug/evidence     # full polygraph evidence bundle
GET    /api/leaderboard             # stake-weighted top MCPs
GET    /api/feed                    # live onchain activity
POST   /api/reviews                 # submit a stake-weighted review (signed)
GET    /api/categories              # category list`}
              </pre>
            </section>

            <section id="polygraph" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">Polygraph</h2>
              <p className="mt-2 text-sm text-white/65">
                Three live checks, six probes, a sandbox that blocks everything
                by default.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                <li>· <b className="text-white">C-01</b> tool-output injection</li>
                <li>· <b className="text-white">C-02</b> permission overreach</li>
                <li>· <b className="text-white">C-03</b> sensitive-data handling</li>
              </ul>
              <p className="mt-3 text-sm text-white/65">
                Grades: A (all passed) · B (passed hijack + leak, network
                unverified) · D (network violation or read-only lie) · F
                (hijack or leak — disqualifying).
              </p>
            </section>

            <section id="token" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">Token</h2>
              <p className="mt-2 text-sm text-white/65">
                $QUIVER on Base. Stake to review, earn when you&rsquo;re right.
              </p>
            </section>

            <section id="security" className="mt-10">
              <h2 className="font-display text-xl font-semibold text-white">Security</h2>
              <p className="mt-2 text-sm text-white/65">
                Grades are pinned to a sha256 fingerprint of the tool
                definitions. A server that adds or removes tools invalidates
                the grade automatically. Evidence bundles are re-verifiable
                offline.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
