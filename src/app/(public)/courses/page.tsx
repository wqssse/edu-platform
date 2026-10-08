import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
export const metadata = { title: 'Курсы' };
export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { number: 'asc' }, include: { semesters: { include: { subjects: { include: { materials: true } } } } } });
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Курсы' }]} />
      <h1 className="text-3xl font-bold mb-8">Все курсы</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => (
          <div key={c.id} className="card p-6">
            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{c.number} курс — {c.title}</h2>
            <div className="flex flex-col gap-3">
              {c.semesters.map(s => {
                const subjCount = s.subjects.length;
                const matCount = s.subjects.reduce((a, sub) => a + sub.materials.length, 0);
                return (
                  <Link key={s.id} href={`/courses/${c.number}/${s.number}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <span className="font-medium group-hover:text-blue-700">{s.number} семестр</span>
                    <span className="text-sm text-gray-400">{subjCount} пред. · {matCount} мат.</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
