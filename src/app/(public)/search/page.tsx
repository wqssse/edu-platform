import { prisma } from '@/lib/prisma';
import Breadcrumbs from '@/components/Breadcrumbs';
import MaterialCard from '@/components/MaterialCard';
import Link from 'next/link';
interface Props { searchParams: { q?: string; course?: string; semester?: string } }
export const metadata = { title: 'Поиск' };
export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? '';
  const courses = await prisma.course.findMany({ orderBy: { number: 'asc' } });
  let materials: any[] = [];
  let subjects: any[] = [];
  if (q) {
    const subjectWhere: any = { OR: [{ title: { contains: q } }, { description: { contains: q } }] };
    if (searchParams.course) {
      const sems = await prisma.semester.findMany({ where: { courseId: parseInt(searchParams.course) }, select: { id: true } });
      subjectWhere.semesterId = { in: sems.map(s => s.id) };
    }
    [materials, subjects] = await Promise.all([
      prisma.material.findMany({ where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] }, include: { subject: true }, take: 20 }),
      prisma.subject.findMany({ where: subjectWhere, include: { semester: { include: { course: true } } }, take: 10 }),
    ]);
  }
  const total = materials.length + subjects.length;
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Поиск' }]} />
      <h1 className="text-3xl font-bold mb-6">Поиск</h1>
      <form className="flex flex-wrap gap-3 mb-8">
        <input name="q" defaultValue={q} placeholder="Введите запрос..." className="input flex-1 min-w-48" />
        <select name="course" defaultValue={searchParams.course ?? ''} className="input w-auto">
          <option value="">Все курсы</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.number} курс</option>)}
        </select>
        <button type="submit" className="btn-primary">🔍 Найти</button>
      </form>
      {q && <p className="text-gray-500 mb-4">Найдено: {total} результатов по «{q}»</p>}
      {subjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Предметы</h2>
          <div className="flex flex-col gap-2">
            {subjects.map((s: any) => (
              <Link key={s.id} href={`/subjects/${s.slug}`} className="card p-4 hover:shadow-md transition-shadow block">
                <p className="text-xs text-blue-600 mb-1">{s.semester.course.number} курс, {s.semester.number} сем.</p>
                <h3 className="font-medium">{s.title}</h3>
                {s.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
      {materials.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Материалы</h2>
          <div className="flex flex-col gap-3">
            {materials.map((m: any) => <div key={m.id}><p className="text-xs text-blue-600 mb-1 ml-1">{m.subject.title}</p><MaterialCard {...m} showCategory /></div>)}
          </div>
        </div>
      )}
      {q && total === 0 && <p className="text-gray-400 text-center py-12">Ничего не найдено.</p>}
    </div>
  );
}
