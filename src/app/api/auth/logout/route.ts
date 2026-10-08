import { NextResponse } from 'next/server';
import { getCookieName } from '@/lib/auth';
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(getCookieName());
  return res;
}
