import Link from 'next/link';
import { formatDate } from '@/lib/utils';
interface Props { id: number; title: string; content: string; createdAt: Date; compact?: boolean; }
export default function NewsCard({ id, title, content, createdAt, compact }: Props) {
  return (
    <Link href={`/news/${id}`} className="block group">
      <div className="card p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
        <p className="text-xs text-gray-400 mb-1">{formatDate(createdAt)}</p>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        {!compact && <p className="text-sm text-gray-500 mt-1 line-clamp-3">{content}</p>}
      </div>
    </Link>
  );
}
