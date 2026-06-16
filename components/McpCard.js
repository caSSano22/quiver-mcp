import Link from 'next/link';
import { mcps } from '@/lib/data';

function gradeColor(g) {
  if (g === 'A') return 'badge-mint';
  if (g === 'B') return 'badge';
  if (g === 'D') return 'badge-amber';
  if (g === 'F') return 'badge-rose';
  return 'badge';
}

export function McpCard({ mcp, compact = false }) {
  return (
    <Link
      href={`/mcp/${mcp.slug}`}
      className="group block card transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-base font-semibold text-white">
              {mcp.name}
            </h3>
            <span className={gradeColor(mcp.grade)}>
              grade {mcp.grade}
            </span>
          </div>
          <div className="mt-0.5 truncate font-mono text-[11px] text-white/40">
            {mcp.package}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {mcp.rating.toFixed(1)}
            <span className="text-white/30"> · ★</span>
          </div>
          <div className="text-[11px] text-white/40">
            {mcp.reviews.toLocaleString()} reviews
          </div>
        </div>
      </div>
      {!compact && (
        <p className="mt-3 line-clamp-2 text-sm text-white/60">
          {mcp.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {mcp.tags.slice(0, 3).map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-white/40">
          {mcp.installs.toLocaleString()} installs
        </span>
      </div>
    </Link>
  );
}
