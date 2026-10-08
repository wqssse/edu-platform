import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isPathSafe } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const material = await prisma.material.findUnique({ where: { id: parseInt(params.id) } });
  if (!material?.filePath) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, material.filePath);
  if (!isPathSafe(filePath, uploadsDir) || !fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(material.filePath);
  const filename = encodeURIComponent(material.title + ext);
  const mimeMap: Record<string, string> = { '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.doc': 'application/msword', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.ppt': 'application/vnd.ms-powerpoint', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
  const mime = mimeMap[ext] ?? 'application/octet-stream';
  return new NextResponse(buffer, { headers: { 'Content-Type': mime, 'Content-Disposition': `attachment; filename*=UTF-8''${filename}` } });
}
