import Link from 'next/link';

import { CATEGORY_META, type MaterialCategory } from '@/lib/categories';
interface Props { title: string; slug: string; description?: string | null; categoryCounts: Partial<Record<MaterialCategory, number>>; }
export default function SubjectCard({ title, slug, description, categoryCounts }: Props) {
  const total = Object.values(categoryCounts).reduce((s, n) => s + (n ?? 0), 0);
  return (
    <Link href={`/subjects/${slug}`}>
      <div className="card p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group h-full flex flex-col">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors text-lg mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-1">{description}</p>}
        <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          {(Object.entries(categoryCounts) as [MaterialCategory, number][]).filter(([, n]) => n > 0).map(([cat, n]) => (
            <span key={cat} className={`badge ${CATEGORY_META[cat].bgColor} ${CATEGORY_META[cat].color}`}>{CATEGORY_META[cat].icon} {n}</span>
          ))}
          {total === 0 && <span className="text-xs text-gray-400">Нет материалов</span>}
        </div>
      </div>
    </Link>
  );
}
