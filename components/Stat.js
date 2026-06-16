export function Stat({ label, value, hint, accent = 'mint' }) {
  const colors = {
    mint: 'text-accent-mint',
    pink: 'text-accent-pink',
    brand: 'text-brand-400',
  };
  return (
    <div className="card">
      <div className="text-[11px] font-medium uppercase tracking-wider text-white/45">
        {label}
      </div>
      <div className={`mt-2 font-display text-2xl font-semibold ${colors[accent]}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-white/45">{hint}</div>}
    </div>
  );
}
