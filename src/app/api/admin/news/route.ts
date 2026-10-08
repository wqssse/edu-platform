import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const news = await prisma.newsItem.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(news);
}
export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 });
  const item = await prisma.newsItem.create({ data: { title, content } });
  return NextResponse.json(item, { status: 201 });
}
