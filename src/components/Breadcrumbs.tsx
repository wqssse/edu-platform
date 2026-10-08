import Link from 'next/link';
interface Crumb { label: string; href?: string; }
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <li><Link href="/" className="hover:text-blue-600 transition-colors">Главная</Link></li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span>/</span>
            {item.href ? <Link href={item.href} className="hover:text-blue-600 transition-colors">{item.label}</Link> : <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
