import { prisma } from '@/lib/prisma';
import MaterialCard from '@/components/MaterialCard';
import Breadcrumbs from '@/components/Breadcrumbs';
interface Props { searchParams: { course?: string; subject?: string; type?: string } }
export const metadata = { title: 'Библиотека' };
export default async function LibraryPage({ searchParams }: Props) {
  const courses = await prisma.course.findMany({ orderBy: { number: 'asc' } });
  const subjects = await prisma.subject.findMany({ orderBy: { title: 'asc' } });
  const where: any = { category: { in: ['TEXTBOOK', 'METHODICAL', 'ADDITIONAL'] } };
  if (searchParams.subject) where.subjectId = parseInt(searchParams.subject);
  if (searchParams.course) {
    const sems = await prisma.semester.findMany({ where: { courseId: parseInt(searchParams.course) }, select: { id: true } });
    const subs = await prisma.subject.findMany({ where: { semesterId: { in: sems.map(s => s.id) } }, select: { id: true } });
    where.subjectId = { in: subs.map(s => s.id) };
  }
  if (searchParams.type) where.category = searchParams.type;
  const materials = await prisma.material.findMany({ where, orderBy: { createdAt: 'desc' }, include: { subject: true } });
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Библиотека' }]} />
      <h1 className="text-3xl font-bold mb-6">Библиотека</h1>
      <form className="flex flex-wrap gap-3 mb-8">
        <select name="course" defaultValue={searchParams.course ?? ''} className="input w-auto" onChange={undefined}>
          <option value="">Все курсы</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.number} курс</option>)}
        </select>
        <select name="subject" defaultValue={searchParams.subject ?? ''} className="input w-auto">
          <option value="">Все предметы</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <select name="type" defaultValue={searchParams.type ?? ''} className="input w-auto">
          <option value="">Все типы</option>
          <option value="TEXTBOOK">Учебники</option>
          <option value="METHODICAL">Методические</option>
          <option value="ADDITIONAL">Дополнительные</option>
        </select>
        <button type="submit" className="btn-primary">Применить</button>
      </form>
      {materials.length === 0 ? <p className="text-gray-400">Материалы не найдены.</p> : (
        <div className="flex flex-col gap-3">
          {materials.map(m => <div key={m.id}><p className="text-xs text-blue-600 mb-1 ml-1">{m.subject.title}</p><MaterialCard {...m} showCategory /></div>)}
        </div>
      )}
    </div>
  );
}
