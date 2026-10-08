import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
export default async function HomePage() {
  const [courses, news, recentMaterials] = await Promise.all([
    prisma.course.findMany({ orderBy: { number: 'asc' }, include: { semesters: true } }),
    prisma.newsItem.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.material.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { subject: true } }),
  ]);
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">🎓 Всё необходимое для учёбы</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">— в одном месте</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="btn-primary text-base px-6 py-3">Выбрать курс</Link>
          <Link href="/library" className="btn-secondary text-base px-6 py-3">Библиотека</Link>
          <Link href="/search" className="btn-secondary text-base px-6 py-3">🔍 Поиск</Link>
        </div>
      </section>
      {/* Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Курсы</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {courses.map(c => (
            <div key={c.id} className="card p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{c.number}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{c.title}</div>
              <div className="flex flex-col gap-1">
                {c.semesters.map(s => (
                  <Link key={s.id} href={`/courses/${c.number}/${s.number}`} className="btn-secondary text-xs py-1 px-2 justify-center">{s.number} сем.</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Recent materials */}
      {recentMaterials.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Новые материалы</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map(m => (
              <Link key={m.id} href={`/subjects/${m.subject.slug}`} className="card p-4 hover:shadow-md transition-shadow block">
                <p className="text-xs text-blue-600 mb-1">{m.subject.title}</p>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{m.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* News */}
      {news.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Новости</h2>
            <Link href="/news" className="text-sm text-blue-600 hover:underline">Все новости →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {news.map(n => <NewsCard key={n.id} {...n} compact />)}
          </div>
        </section>
      )}
    </div>
  );
}
