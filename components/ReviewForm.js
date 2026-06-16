'use client';

import { useState } from 'react';
import { ConnectButton } from './ConnectButton';

const GRADES = ['A', 'B', 'D', 'F'];
const MIN_STAKE = 1; // $QUIVER

export function ReviewForm({ mcpSlug, address, onSubmitted }) {
  const [grade, setGrade] = useState('A');
  const [stake, setStake] = useState('10');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!address) {
      setError('Connect a wallet first.');
      return;
    }
    if (body.length < 20) {
      setError('Review must be at least 20 characters.');
      return;
    }
    if (Number(stake) < MIN_STAKE) {
      setError(`Minimum stake is ${MIN_STAKE} $QUIVER.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/mcps/${mcpSlug}/reviews`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          reviewer: address,
          stakeAmount: (Number(stake) * 1e18).toString(),
          grade,
          body,
          wallet: address,
        }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'submit failed');
      setDone(data.review);
      onSubmitted?.(data.review);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card">
        <div className="badge-mint">submitted</div>
        <p className="mt-3 text-sm text-white/75">
          Your stake-weighted review of <span className="font-mono">{mcpSlug}</span> is in.
          When the community votes it up, you earn from the rewards pool.
        </p>
        <button
          type="button"
          onClick={() => { setDone(null); setBody(''); }}
          className="btn-ghost mt-4"
        >
          write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-white">
          Submit a stake-weighted review
        </h3>
        <ConnectButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-wider text-white/45">
            Grade
          </span>
          <div className="mt-1.5 flex gap-1.5">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={
                  'flex-1 rounded-lg border px-3 py-2 text-sm font-mono font-semibold transition ' +
                  (grade === g
                    ? g === 'A'
                      ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                      : g === 'B'
                      ? 'border-white/20 bg-white/10 text-white'
                      : g === 'D'
                      ? 'border-amber-300/40 bg-amber-300/15 text-amber-200'
                      : 'border-rose-300/40 bg-rose-300/15 text-rose-200'
                    : 'border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.06]')
                }
              >
                {g}
              </button>
            ))}
          </div>
        </label>
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-wider text-white/45">
            Stake (min 1 $QUIVER)
          </span>
          <input
            type="number"
            min={MIN_STAKE}
            step="1"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-wider text-white/45">
          Review (20+ chars)
        </span>
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you actually try? What worked, what didn't?"
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <p className="text-xs text-white/45">
          Stake is locked until the community votes. If you shill, you can be slashed.
        </p>
        <button
          type="submit"
          disabled={busy || !address}
          className="btn-primary disabled:opacity-50"
        >
          {busy ? 'submitting…' : `Stake ${stake} $QUIVER`}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </div>
      )}
    </form>
  );
}
