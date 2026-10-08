import { prisma } from '@/lib/prisma';
import NewsCard from '@/components/NewsCard';
import Breadcrumbs from '@/components/Breadcrumbs';
export const metadata = { title: 'Новости' };
export default async function NewsPage() {
  const news = await prisma.newsItem.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Новости' }]} />
      <h1 className="text-3xl font-bold mb-8">Новости</h1>
      {news.length === 0 ? <p className="text-gray-400">Новостей пока нет.</p> : <div className="flex flex-col gap-4">{news.map(n => <NewsCard key={n.id} {...n} />)}</div>}
    </div>
  );
}
