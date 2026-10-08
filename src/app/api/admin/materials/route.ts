import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeFileName, ALLOWED_EXT, MAX_FILE_SIZE } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get('subjectId');
  const where = subjectId ? { subjectId: parseInt(subjectId) } : {};
  const materials = await prisma.material.findMany({ where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  return NextResponse.json(materials);
}
export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const subjectId = parseInt(fd.get('subjectId') as string);
  const category = fd.get('category') as string;
  const title = fd.get('title') as string;
  const description = (fd.get('description') as string) || undefined;
  const order = parseInt((fd.get('order') as string) || '1');
  const file = fd.get('file') as File | null;
  if (!subjectId || !category || !title) return NextResponse.json({ error: 'Недостаточно данных' }, { status: 400 });
  let filePath: string | undefined;
  let fileType: string | undefined;
  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Файл слишком большой (макс. 50 МБ)' }, { status: 413 });
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) return NextResponse.json({ error: 'Недопустимый тип файла' }, { status: 400 });
    const uploadsDir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}_${sanitizeFileName(file.name)}`;
    const dest = path.join(uploadsDir, safeName);
    const buf = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(dest, buf);
    filePath = safeName;
    fileType = ext.slice(1);
  }
  const material = await prisma.material.create({ data: { subjectId, category: category as any, title, description, filePath, fileType, order } });
  return NextResponse.json(material, { status: 201 });
}
