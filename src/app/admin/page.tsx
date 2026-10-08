'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, password }) });
      if (res.ok) router.push('/admin/dashboard');
      else { const d = await res.json(); setError(d.error ?? 'Ошибка входа'); }
    } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-2">🎓 Администратор</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Образовательная платформа</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Логин</label><input value={login} onChange={e => setLogin(e.target.value)} className="input" required autoComplete="username" /></div>
          <div><label className="label">Пароль</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" required autoComplete="current-password" /></div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Вход...' : 'Войти'}</button>
        </form>
      </div>
    </div>
  );
}
