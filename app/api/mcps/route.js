import { NextResponse } from 'next/server';
import { fetchMCPs } from '@/lib/fetch-mcps';

export const revalidate = 3600; // 1h

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat') || 'all';
  const q = (searchParams.get('q') || '').toLowerCase();

  const all = await fetchMCPs();
  const filtered = all
    .filter((m) => (cat === 'all' ? true : m.category === cat))
    .filter((m) =>
      q
        ? (m.name + ' ' + m.description + ' ' + m.tags.join(' '))
            .toLowerCase()
            .includes(q)
        : true
    )
    .sort((a, b) => b.installs - a.installs);

  return NextResponse.json({
    ok: true,
    count: filtered.length,
    total: all.length,
    mcps: filtered,
    asOf: new Date().toISOString(),
  });
}
