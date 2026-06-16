import { NextResponse } from 'next/server';
import { fetchMCPs } from '@/lib/fetch-mcps';
import { getReviews } from '@/lib/store';

export const revalidate = 600;

export async function GET(request, { params }) {
  const { slug } = params;
  const all = await fetchMCPs();
  const m = all.find((x) => x.slug === slug);
  if (!m) {
    return NextResponse.json(
      { ok: false, error: 'MCP not found' },
      { status: 404 }
    );
  }
  const reviews = await getReviews(slug);
  return NextResponse.json({ ok: true, mcp: m, reviews });
}
