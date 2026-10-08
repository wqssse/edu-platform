import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import MaterialCard from '@/components/MaterialCard';
import { CATEGORY_META, ALL_CATEGORIES, type MaterialCategory } from '@/lib/categories';

interface Props { params: { slug: string }; searchParams: { tab?: string } }
export async function generateMetadata({ params }: Props) { return { title: params.slug }; }
export default async function SubjectPage({ params, searchParams }: Props) {
  const subject = await prisma.subject.findUnique({ where: { slug: params.slug }, include: { semester: { include: { course: true } }, materials: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] } } });
  if (!subject) notFound();
  const activeTab = (searchParams.tab as MaterialCategory) ?? 'LECTURE';
  const byCategory: Record<MaterialCategory, typeof subject.materials> = {} as any;
  ALL_CATEGORIES.forEach(c => { byCategory[c] = subject.materials.filter(m => m.category === c); });
  const crumbs = [
    { label: 'Курсы', href: '/courses' },
    { label: `${subject.semester.course.number} курс`, href: `/courses/${subject.semester.course.number}/${subject.semester.number}` },
    { label: `${subject.semester.number} семестр`, href: `/courses/${subject.semester.course.number}/${subject.semester.number}` },
    { label: subject.title },
  ];
  return (
    <div>
      <Breadcrumbs items={crumbs} />
      <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
      {subject.description && <p className="text-gray-500 mb-6">{subject.description}</p>}
      {/* tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
        {ALL_CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          const isActive = cat === activeTab;
          return (
            <a key={cat} href={`?tab=${cat}`} className={`px-3 py-2 rounded-t-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {meta.icon} {meta.label} <span className="opacity-70">({byCategory[cat].length})</span>
            </a>
          );
        })}
      </div>
      {byCategory[activeTab].length === 0 ? <p className="text-gray-400 py-8 text-center">Материалов пока нет.</p> : (
        <div className="flex flex-col gap-3">
          {byCategory[activeTab].map(m => <MaterialCard key={m.id} {...m} order={activeTab === 'LECTURE' ? m.order : undefined} />)}
        </div>
      )}
    </div>
  );
}
