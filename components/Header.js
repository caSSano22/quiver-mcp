'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ConnectButton } from './ConnectButton';

const links = [
  { href: '/directory', label: 'Directory' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/token', label: '$QUIVER' },
  { href: '/x', label: 'X' },
  { href: '/docs', label: 'Docs' },
];

export function Header() {
  const [address, setAddress] = useState(null);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" aria-label="Quiver home" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ConnectButton onConnect={setAddress} />
          </div>
          <Link href="/submit" className="btn-primary !py-2 !text-xs">
            Submit MCP
          </Link>
        </div>
      </div>
    </header>
  );
}
