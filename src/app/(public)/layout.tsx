import Navbar from '@/components/Navbar';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main><footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-400">© {new Date().getFullYear()} Образовательная платформа</footer></div>;
}
