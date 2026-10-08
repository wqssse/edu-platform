import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.course.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ ok: true });
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const course = await prisma.course.update({ where: { id: parseInt(params.id) }, data });
  return NextResponse.json(course);
}
