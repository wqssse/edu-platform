import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, getCookieName } from '@/lib/auth';
export async function POST(req: NextRequest) {
  const { login, password } = await req.json();
  if (!login || !password) return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 });
  const admin = await prisma.admin.findUnique({ where: { login } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  const token = await signToken({ login });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), token, { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 60 * 60 * 8 });
  return res;
}
