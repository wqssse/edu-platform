'use client';
import { useEffect, useState } from 'react';
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) { html.classList.remove('dark'); localStorage.setItem('theme','light'); setDark(false); }
    else { html.classList.add('dark'); localStorage.setItem('theme','dark'); setDark(true); }
  };
  return <button onClick={toggle} aria-label="Тема" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{dark ? '☀️' : '🌙'}</button>;
}
