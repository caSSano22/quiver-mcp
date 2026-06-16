import { NextResponse } from 'next/server';
import { addReview, pushActivity, getReviews } from '@/lib/store';

export async function GET(request, { params }) {
  const { slug } = params;
  const reviews = await getReviews(slug);
  return NextResponse.json({ ok: true, reviews });
}

export async function POST(request, { params }) {
  const { slug } = params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
  const { reviewer, grade, body: text, wallet, signature } = body;
  if (!reviewer || !grade || !text) {
    return NextResponse.json(
      { ok: false, error: 'missing fields: reviewer, grade, body' },
      { status: 400 }
    );
  }
  if (text.length < 20 || text.length > 2000) {
    return NextResponse.json(
      { ok: false, error: 'review length 20-2000 chars' },
      { status: 400 }
    );
  }

  // TODO: verify wallet signature once reviews require auth.
  // For now we record the review and mark the wallet for off-chain verification.
  const review = await addReview({
    mcpSlug: slug,
    reviewer,
    grade,
    body: text,
    wallet: wallet || reviewer,
    signature: signature || null,
    verified: false,
    votes: { up: 0, down: 0 },
  });
  await pushActivity({
    who: reviewer.slice(0, 6) + '…' + reviewer.slice(-4),
    action: 'reviewed',
    what: slug,
    kind: 'review',
    grade,
  });

  return NextResponse.json({ ok: true, review });
}
