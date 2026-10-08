import { MaterialCategory } from '@prisma/client'
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SubjectCard from '@/components/SubjectCard';

interface Props { params: { course: string; semester: string } }
export async function generateMetadata({ params }: Props) { return { title: `${params.course} курс, ${params.semester} семестр` }; }
export default async function SemesterPage({ params }: Props) {
  const courseNum = parseInt(params.course);
  const semNum = parseInt(params.semester);
  if (isNaN(courseNum) || isNaN(semNum)) notFound();
  const semester = await prisma.semester.findFirst({
    where: { number: semNum, course: { number: courseNum } },
    include: { course: true, subjects: { include: { materials: { select: { category: true } } } } },
  });
  if (!semester) notFound();
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Курсы', href: '/courses' }, { label: `${courseNum} курс`, href: `/courses` }, { label: `${semNum} семестр` }]} />
      <h1 className="text-3xl font-bold mb-2">{semester.course.title}</h1>
      <p className="text-gray-500 mb-8">{semNum} семестр</p>
      {semester.subjects.length === 0 ? <p className="text-gray-400">Предметы ещё не добавлены.</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester.subjects.map(sub => {
            const counts: Partial<Record<MaterialCategory, number>> = {};
            sub.materials.forEach(m => { counts[m.category] = (counts[m.category] ?? 0) + 1; });
            return <SubjectCard key={sub.id} title={sub.title} slug={sub.slug} description={sub.description} categoryCounts={counts} />;
          })}
        </div>
      )}
    </div>
  );
}
