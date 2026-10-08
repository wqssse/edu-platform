import path from 'path';
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}
export function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-а-яёА-ЯЁ]/g, '_').replace(/_{2,}/g, '_').slice(0, 200);
}
export function isPathSafe(filePath: string, baseDir: string) {
  const resolved = path.resolve(filePath);
  const base = path.resolve(baseDir);
  return resolved.startsWith(base + path.sep) || resolved === base;
}
export const ALLOWED_EXT = ['.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.png','.jpg','.jpeg','.gif','.webp','.txt','.zip'];
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export function getFileIcon(fileType: string | null | undefined) {
  if (!fileType) return '📄';
  const e = fileType.toLowerCase();
  if (e.includes('pdf')) return '📕';
  if (e.includes('doc')) return '📘';
  if (e.includes('ppt')) return '📊';
  if (e.includes('xls')) return '📗';
  if (['png','jpg','jpeg','gif','webp'].some(x => e.includes(x))) return '🖼️';
  return '📄';
}
