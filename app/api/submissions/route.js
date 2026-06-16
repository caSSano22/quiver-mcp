import { NextResponse } from 'next/server';
import { addSubmission, pushActivity } from '@/lib/store';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
  const { name, package: pkg, category, transport, description, contact } = body;
  if (!name || !pkg || !description || !contact) {
    return NextResponse.json(
      { ok: false, error: 'missing fields' },
      { status: 400 }
    );
  }
  const sub = await addSubmission({ name, package: pkg, category, transport, description, contact });
  await pushActivity({
    who: contact.startsWith('@') ? contact : '@' + contact,
    action: 'submitted',
    what: name,
    kind: 'submit',
  });
  return NextResponse.json({ ok: true, submission: sub });
}
