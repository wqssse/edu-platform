import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: NextRequest) {
  const semesterId = req.nextUrl.searchParams.get('semesterId');
  const where = semesterId ? { semesterId: parseInt(semesterId) } : {};
  const subjects = await prisma.subject.findMany({ where, orderBy: { title: 'asc' } });
  return NextResponse.json(subjects);
}
export async function POST(req: NextRequest) {
  const { semesterId, title, slug, description } = await req.json();
  if (!semesterId || !title || !slug) return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 });
  try {
    const subject = await prisma.subject.create({ data: { semesterId, title, slug, description } });
    return NextResponse.json(subject, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Slug уже занят' }, { status: 409 });
  }
}
