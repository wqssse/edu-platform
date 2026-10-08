import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isPathSafe } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const m = await prisma.material.findUnique({ where: { id: parseInt(params.id) } });
  if (m?.filePath) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const fp = path.join(uploadsDir, m.filePath);
    if (isPathSafe(fp, uploadsDir) && fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  await prisma.material.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ ok: true });
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const m = await prisma.material.update({ where: { id: parseInt(params.id) }, data });
  return NextResponse.json(m);
}
