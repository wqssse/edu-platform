
import { CATEGORY_META, type MaterialCategory } from '@/lib/categories';
import { formatDate, getFileIcon } from '@/lib/utils';
interface Props {
  id: number; title: string; description?: string | null; category: MaterialCategory;
  fileType?: string | null; filePath?: string | null; createdAt: Date; order?: number; showCategory?: boolean;
}
export default function MaterialCard({ id, title, description, category, fileType, filePath, createdAt, order, showCategory }: Props) {
  const meta = CATEGORY_META[category];
  const hasFile = Boolean(filePath);
  const isPdf = fileType?.toLowerCase().includes('pdf');
  return (
    <div className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
      {order !== undefined && <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-500 flex-shrink-0 mt-0.5">{order}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            {showCategory && <span className={`badge ${meta.bgColor} ${meta.color} mb-1`}>{meta.icon} {meta.label}</span>}
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{getFileIcon(fileType)} {title}</h3>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{description}</p>}
            <p className="text-xs text-gray-400 mt-1">{formatDate(createdAt)}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {hasFile && isPdf && <a href={`/api/files/view/${id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1 px-3">Открыть</a>}
            {hasFile && <a href={`/api/files/download/${id}`} className="btn-primary text-xs py-1 px-3">Скачать</a>}
            {!hasFile && <span className="text-xs text-gray-400 italic">Файл не загружен</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
