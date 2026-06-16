import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Token · Quiver',
  description: 'Quiver is a directory first. Token details will be published when (and if) one ships.',
};

export default function TokenPage() {
  return (
    <>
      <Header />
      <main className="container-page py-24">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-xs font-mono text-brand-400">// the token</div>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white sm:text-5xl">
            Not launched.
          </h1>
          <p className="mt-4 text-white/65">
            Quiver is shipping as a directory + public review market first.
            If a token ever gets added, this page is where the contract address,
            distribution, and audit will live — with receipts, not promises.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/directory" className="btn-primary">
              Browse the directory →
            </Link>
            <Link href="/docs" className="btn-ghost">
              Read the spec
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
