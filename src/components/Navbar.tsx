import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
const L = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{children}</Link>
);
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-blue-700 dark:text-blue-400">🎓 ОбрПлатформа</Link>
        <div className="hidden sm:flex items-center gap-1">
          <L href="/courses">Курсы</L>
          <L href="/library">Библиотека</L>
          <L href="/news">Новости</L>
          <L href="/search">Поиск</L>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
