import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const courses = await prisma.course.findMany({ orderBy: { number: 'asc' }, include: { semesters: { include: { subjects: true } } } });
  return NextResponse.json(courses);
}
export async function POST(req: NextRequest) {
  const { number, title } = await req.json();
  if (!number || !title) return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 });
  const course = await prisma.course.create({ data: { number, title } });
  return NextResponse.json(course, { status: 201 });
}
