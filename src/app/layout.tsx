import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'ОбрПлатформа', template: '%s | ОбрПлатформа' },
  description: 'Единое хранилище учебных материалов для студентов',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}` }} /></head>
      <body>{children}</body>
    </html>
  );
}
