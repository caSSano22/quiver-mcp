import { liveFeed } from '@/lib/data';

const kindColor = {
  submit: 'badge',
  verify: 'badge-mint',
  review: 'badge-amber',
  claim: 'badge',
  update: 'badge',
  fix: 'badge-mint',
  request: 'badge',
  join: 'badge',
  star: 'badge',
};

export function LiveFeed() {
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-white/60">
            live activity
          </span>
        </div>
        <span className="text-[11px] text-white/30">refreshed 2s ago</span>
      </div>
      <ul className="divide-y divide-white/5">
        {liveFeed.map((row, i) => (
          <li
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12.5px]"
          >
            <span className="w-20 shrink-0 text-white/45">{row.who}</span>
            <span className="w-16 shrink-0 text-white/40">{row.action}</span>
            <span className="flex-1 truncate text-white/85">{row.what}</span>
            <span className={kindColor[row.kind] || 'badge'}>{row.kind}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
