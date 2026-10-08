import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import MaterialCard from '@/components/MaterialCard';
export async function generateMetadata({ params }: { params: { slug: string } }) { return { title: `Лекции: ${params.slug}` }; }
export default async function LecturesPage({ params }: { params: { slug: string } }) {
  const subject = await prisma.subject.findUnique({ where: { slug: params.slug }, include: { semester: { include: { course: true } }, materials: { where: { category: 'LECTURE' }, orderBy: { order: 'asc' } } } });
  if (!subject) notFound();
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Курсы', href: '/courses' }, { label: subject.title, href: `/subjects/${subject.slug}` }, { label: 'Лекции' }]} />
      <h1 className="text-3xl font-bold mb-2">Лекции: {subject.title}</h1>
      <p className="text-gray-500 mb-6">{subject.semester.course.number} курс, {subject.semester.number} семестр</p>
      {subject.materials.length === 0 ? <p className="text-gray-400">Лекций нет.</p> : (
        <div className="flex flex-col gap-3">
          {subject.materials.map(m => <MaterialCard key={m.id} {...m} />)}
        </div>
      )}
    </div>
  );
}
