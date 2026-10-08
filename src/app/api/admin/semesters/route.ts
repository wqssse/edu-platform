import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest) {
  const { courseId, number } = await req.json();
  try {
    const semester = await prisma.semester.create({ data: { courseId, number } });
    return NextResponse.json(semester, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Семестр уже существует' }, { status: 409 });
  }
}
