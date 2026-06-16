'use client';

import { useState } from 'react';

export default function Submit() {
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    package: '',
    category: 'developer',
    transport: 'stdio',
    description: '',
    contact: '',
  });

  function update(k) {
    return (e) => setForm({ ...form, [k]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'submit failed');
      setSubmitted(data.submission);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-xs font-mono text-brand-400">// submit</div>
      <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
        Submit an MCP
      </h1>
      <p className="mt-2 text-white/65">
        We index in &lt;6 hours. Polygraph runs are scheduled in priority order:
        paid first, free second.
      </p>

      {submitted ? (
        <div className="card mt-8">
          <div className="badge-mint">received</div>
          <h2 className="mt-3 font-display text-xl font-semibold text-white">
            Submission #{submitted.id.split('_')[0]} queued.
          </h2>
          <p className="mt-2 text-sm text-white/65">
            We&rsquo;ll email you when the MCP is live. Want a polygraph
            skip-the-queue? Stake 1,000 $QUIVER from the linked wallet.
          </p>
          <div className="mt-5 rounded-lg border border-white/10 bg-ink-900/50 p-3 text-xs text-white/65">
            <div className="font-mono">{submitted.package}</div>
            <div className="mt-1 text-white/45">{submitted.description}</div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-8 space-y-4">
          <Field label="Name" required>
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Postgres MCP"
              className="input"
            />
          </Field>
          <Field label="Package or URL" required>
            <input
              required
              value={form.package}
              onChange={update('package')}
              placeholder="npm/@scope/server  or  https://mcp.example.com"
              className="input"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                value={form.category}
                onChange={update('category')}
                className="input"
              >
                {['docs','browser','crypto','data','developer','productivity','search','storage'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Transport" required>
              <select
                value={form.transport}
                onChange={update('transport')}
                className="input"
              >
                <option value="stdio">stdio</option>
                <option value="http">http</option>
                <option value="sse">sse</option>
              </select>
            </Field>
          </div>
          <Field label="Description" required>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={update('description')}
              placeholder="One paragraph — what does it do, why is it useful?"
              className="input"
            />
          </Field>
          <Field label="Contact (X or email)" required>
            <input
              required
              value={form.contact}
              onChange={update('contact')}
              placeholder="@yourhandle or you@email.com"
              className="input"
            />
          </Field>
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="text-xs text-white/40">
              By submitting, you agree to the polygraph run. We&rsquo;ll
              publish the grade publicly.
            </div>
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
              {busy ? 'submitting…' : 'Submit'}
            </button>
          </div>
          {error && (
            <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </div>
          )}
          <style jsx>{`
            :global(.input) {
              width: 100%;
              border-radius: 0.75rem;
              border: 1px solid rgba(255, 255, 255, 0.1);
              background: rgba(10, 12, 18, 0.6);
              padding: 0.625rem 0.875rem;
              font-size: 0.875rem;
              color: white;
            }
            :global(.input::placeholder) {
              color: rgba(255, 255, 255, 0.3);
            }
            :global(.input:focus) {
              outline: none;
              border-color: #7c5cff;
            }
          `}</style>
        </form>
      )}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-white/45">
        {label} {required && <span className="text-brand-400">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
