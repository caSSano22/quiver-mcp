import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-white/55">
              The directory for AI agent tools. Discover, review, and rate MCP
              servers powering the agent economy.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/40">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-white/70 hover:text-white" href="/directory">
                  Directory
                </Link>
              </li>
              <li>
                <Link className="text-white/70 hover:text-white" href="/leaderboard">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link className="text-white/70 hover:text-white" href="/token">
                  $QUIVER token
                </Link>
              </li>
              <li>
                <Link className="text-white/70 hover:text-white" href="/submit">
                  Submit MCP
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/40">
              Build
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-white/70 hover:text-white" href="/docs">
                  Docs
                </Link>
              </li>
              <li>
                <Link className="text-white/70 hover:text-white" href="/docs#api">
                  API
                </Link>
              </li>
              <li>
                <Link className="text-white/70 hover:text-white" href="/docs#cli">
                  CLI
                </Link>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-white"
                  href="https://github.com/caSSano22/quiver-mcp"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/40">
              Network
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  className="text-white/70 hover:text-white"
                  href="https://x.com/quivermcp"
                  target="_blank"
                  rel="noreferrer"
                >
                  @quivermcp
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-white"
                  href="https://app.virtuals.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  Virtuals
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-white"
                  href={`https://basescan.org/address/${'0x5e2d60835011c14a978bc958d6ec31dccc440770'}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Basescan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <span>© 2026 Quiver Labs. Built on Base.</span>
          <span className="font-mono">$QUIVER · CA 0x5e2d…0770 · live</span>
        </div>
      </div>
    </footer>
  );
}
