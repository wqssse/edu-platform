import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { formatDate } from '@/lib/utils';
export default async function NewsItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.newsItem.findUnique({ where: { id: parseInt(params.id) } });
  if (!item) notFound();
  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: 'Новости', href: '/news' }, { label: item.title }]} />
      <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
      <p className="text-sm text-gray-400 mb-8">{formatDate(item.createdAt)}</p>
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</div>
    </div>
  );
}
