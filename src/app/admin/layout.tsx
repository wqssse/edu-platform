import type { Metadata } from 'next';
export const metadata: Metadata = { title: { default: 'Админ', template: '%s | Админ' } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {children}
    </div>
  );
}
