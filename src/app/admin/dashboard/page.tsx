'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORY_META, ALL_CATEGORIES } from '@/lib/categories';

type Course = { id: number; number: number; title: string; semesters: Semester[] };
type Semester = { id: number; courseId: number; number: number; subjects: Subject[] };
type Subject = { id: number; semesterId: number; title: string; slug: string; description?: string };
type Material = { id: number; subjectId: number; category: string; title: string; description?: string; filePath?: string; fileType?: string; order: number; createdAt: string };
type NewsItem = { id: number; title: string; content: string; createdAt: string };

type Tab = 'courses' | 'subjects' | 'materials' | 'news';

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [msg, setMsg] = useState('');

  // Forms
  const [cForm, setCForm] = useState({ number: '', title: '' });
  const [sForm, setSForm] = useState({ semesterNumber: '', title: '', slug: '', description: '' });
  const [mForm, setMForm] = useState({ category: 'LECTURE', title: '', description: '', order: '1', file: null as File | null });
  const [nForm, setNForm] = useState({ title: '', content: '' });
  const [semesterForSubject, setSemesterForSubject] = useState<number | null>(null);

  const api = async (url: string, opts: RequestInit = {}) => {
    const res = await fetch(url, opts);
    if (res.status === 401) { router.push('/admin'); return null; }
    return res;
  };

  const loadCourses = useCallback(async () => {
    const res = await api('/api/admin/courses');
    if (res?.ok) setCourses(await res.json());
  }, []);

  const loadSubjects = useCallback(async (semId: number) => {
    const res = await api(`/api/admin/subjects?semesterId=${semId}`);
    if (res?.ok) setSubjects(await res.json());
  }, []);

  const loadMaterials = useCallback(async (subId: number) => {
    const res = await api(`/api/admin/materials?subjectId=${subId}`);
    if (res?.ok) setMaterials(await res.json());
  }, []);

  const loadNews = useCallback(async () => {
    const res = await api('/api/admin/news');
    if (res?.ok) setNews(await res.json());
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);
  useEffect(() => { if (tab === 'news') loadNews(); }, [tab, loadNews]);
  useEffect(() => { if (selectedSemester) loadSubjects(selectedSemester); }, [selectedSemester, loadSubjects]);
  useEffect(() => { if (selectedSubject) loadMaterials(selectedSubject); }, [selectedSubject, loadMaterials]);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin'); };

  // ── COURSES ──
  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api('/api/admin/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number: parseInt(cForm.number), title: cForm.title }) });
    if (res?.ok) { setCForm({ number: '', title: '' }); loadCourses(); flash('Курс создан'); }
    else flash('Ошибка');
  };
  const deleteCourse = async (id: number) => {
    if (!confirm('Удалить курс?')) return;
    await api(`/api/admin/courses/${id}`, { method: 'DELETE' }); loadCourses(); flash('Удалён');
  };
  const createSemester = async (courseId: number, num: number) => {
    const res = await api('/api/admin/semesters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, number: num }) });
    if (res?.ok) { loadCourses(); flash('Семестр добавлен'); } else flash('Уже существует');
  };

  // ── SUBJECTS ──
  const createSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterForSubject) return flash('Выберите семестр');
    const res = await api('/api/admin/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ semesterId: semesterForSubject, title: sForm.title, slug: sForm.slug, description: sForm.description }) });
    if (res?.ok) { setSForm({ semesterNumber: '', title: '', slug: '', description: '' }); if (selectedSemester) loadSubjects(selectedSemester); loadCourses(); flash('Предмет создан'); }
    else { const d = await res?.json(); flash(d?.error ?? 'Ошибка'); }
  };
  const deleteSubject = async (id: number) => {
    if (!confirm('Удалить предмет?')) return;
    await api(`/api/admin/subjects/${id}`, { method: 'DELETE' }); if (selectedSemester) loadSubjects(selectedSemester); flash('Удалён');
  };

  // ── MATERIALS ──
  const createMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return flash('Выберите предмет');
    const fd = new FormData();
    fd.append('subjectId', String(selectedSubject));
    fd.append('category', mForm.category);
    fd.append('title', mForm.title);
    fd.append('description', mForm.description);
    fd.append('order', mForm.order);
    if (mForm.file) fd.append('file', mForm.file);
    const res = await api('/api/admin/materials', { method: 'POST', body: fd });
    if (res?.ok) { setMForm({ category: 'LECTURE', title: '', description: '', order: '1', file: null }); loadMaterials(selectedSubject); flash('Материал добавлен'); }
    else { const d = await res?.json(); flash(d?.error ?? 'Ошибка'); }
  };
  const deleteMaterial = async (id: number) => {
    if (!confirm('Удалить?')) return;
    await api(`/api/admin/materials/${id}`, { method: 'DELETE' }); if (selectedSubject) loadMaterials(selectedSubject); flash('Удалён');
  };

  // ── NEWS ──
  const createNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nForm) });
    if (res?.ok) { setNForm({ title: '', content: '' }); loadNews(); flash('Новость опубликована'); }
    else flash('Ошибка');
  };
  const deleteNews = async (id: number) => {
    if (!confirm('Удалить?')) return;
    await api(`/api/admin/news/${id}`, { method: 'DELETE' }); loadNews(); flash('Удалено');
  };

  const tabs: { id: Tab; label: string }[] = [{ id: 'courses', label: 'Курсы & Семестры' }, { id: 'subjects', label: 'Предметы' }, { id: 'materials', label: 'Материалы' }, { id: 'news', label: 'Новости' }];

  const allSemesters = courses.flatMap(c => (c.semesters ?? []).map(s => ({ ...s, courseNumber: c.number, courseTitle: c.title })));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🎓 Панель администратора</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-green-600 font-medium">{msg}</span>}
          <a href="/" target="_blank" className="btn-secondary text-sm">Открыть сайт</a>
          <button onClick={logout} className="btn-danger text-sm">Выйти</button>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex gap-1">
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>{t.label}</button>)}
      </div>
      <div className="p-6 max-w-6xl mx-auto">
        {/* === COURSES === */}
        {tab === 'courses' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Создать курс</h2>
              <form onSubmit={createCourse} className="card p-4 space-y-3">
                <div><label className="label">Номер курса (1–6)</label><input type="number" min={1} max={6} value={cForm.number} onChange={e => setCForm(p => ({ ...p, number: e.target.value }))} className="input" required /></div>
                <div><label className="label">Название</label><input value={cForm.title} onChange={e => setCForm(p => ({ ...p, title: e.target.value }))} className="input" placeholder="1 курс" required /></div>
                <button type="submit" className="btn-primary">Создать курс</button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Курсы</h2>
              <div className="flex flex-col gap-4">
                {courses.map(c => (
                  <div key={c.id} className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{c.number} курс — {c.title}</span>
                      <button onClick={() => deleteCourse(c.id)} className="text-red-500 text-sm hover:underline">Удалить</button>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2].map(num => {
                        const exists = c.semesters?.some(s => s.number === num);
                        return exists
                          ? <span key={num} className="badge bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">{num} сем. ✓</span>
                          : <button key={num} onClick={() => createSemester(c.id, num)} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-700 cursor-pointer">+ {num} сем.</button>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* === SUBJECTS === */}
        {tab === 'subjects' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Создать предмет</h2>
              <form onSubmit={createSubject} className="card p-4 space-y-3">
                <div><label className="label">Семестр</label>
                  <select value={semesterForSubject ?? ''} onChange={e => setSemesterForSubject(parseInt(e.target.value))} className="input" required>
                    <option value="">Выберите семестр</option>
                    {allSemesters.map(s => <option key={s.id} value={s.id}>{s.courseTitle} — {s.number} сем.</option>)}
                  </select>
                </div>
                <div><label className="label">Название</label><input value={sForm.title} onChange={e => setSForm(p => ({ ...p, title: e.target.value }))} className="input" required /></div>
                <div><label className="label">Slug (URL)</label><input value={sForm.slug} onChange={e => setSForm(p => ({ ...p, slug: e.target.value }))} className="input" placeholder="anatomy" required /></div>
                <div><label className="label">Описание</label><textarea value={sForm.description} onChange={e => setSForm(p => ({ ...p, description: e.target.value }))} className="input" rows={2} /></div>
                <button type="submit" className="btn-primary">Создать предмет</button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Предметы</h2>
              <div className="mb-3">
                <select value={selectedSemester ?? ''} onChange={e => { const v = parseInt(e.target.value); setSelectedSemester(v); loadSubjects(v); }} className="input">
                  <option value="">Выберите семестр</option>
                  {allSemesters.map(s => <option key={s.id} value={s.id}>{s.courseTitle} — {s.number} сем.</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                {subjects.map(s => (
                  <div key={s.id} className="card p-3 flex items-center justify-between">
                    <div><span className="font-medium">{s.title}</span><span className="text-xs text-gray-400 ml-2">/{s.slug}</span></div>
                    <button onClick={() => deleteSubject(s.id)} className="text-red-500 text-sm hover:underline">Удалить</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* === MATERIALS === */}
        {tab === 'materials' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Добавить материал</h2>
              <form onSubmit={createMaterial} className="card p-4 space-y-3">
                <div><label className="label">Предмет</label>
                  <select value={selectedSubject ?? ''} onChange={e => { const v = parseInt(e.target.value); setSelectedSubject(v); loadMaterials(v); }} className="input" required>
                    <option value="">Выберите предмет</option>
                    {allSemesters.map(sem => {
                      const subs = courses.flatMap(c => (c.semesters ?? []).filter(s => s.id === sem.id).flatMap(s => s.subjects ?? []));
                      return subs.length > 0 ? <optgroup key={sem.id} label={`${sem.courseTitle} — ${sem.number} сем.`}>{subs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</optgroup> : null;
                    })}
                  </select>
                </div>
                <div><label className="label">Категория</label>
                  <select value={mForm.category} onChange={e => setMForm(p => ({ ...p, category: e.target.value }))} className="input">
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
                  </select>
                </div>
                <div><label className="label">Название</label><input value={mForm.title} onChange={e => setMForm(p => ({ ...p, title: e.target.value }))} className="input" required /></div>
                <div><label className="label">Описание</label><textarea value={mForm.description} onChange={e => setMForm(p => ({ ...p, description: e.target.value }))} className="input" rows={2} /></div>
                <div><label className="label">Порядок (для лекций)</label><input type="number" min={1} value={mForm.order} onChange={e => setMForm(p => ({ ...p, order: e.target.value }))} className="input" /></div>
                <div><label className="label">Файл (PDF, DOCX, PPTX, изображение, до 50 МБ)</label><input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.txt,.zip" onChange={e => setMForm(p => ({ ...p, file: e.target.files?.[0] ?? null }))} className="input" /></div>
                <button type="submit" className="btn-primary">Добавить</button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Материалы предмета</h2>
              <div className="flex flex-col gap-2">
                {materials.map(m => (
                  <div key={m.id} className="card p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-blue-600">{CATEGORY_META[m.category as keyof typeof CATEGORY_META]?.label}</span>
                      <p className="font-medium text-sm truncate">{m.title}</p>
                      {m.filePath ? <span className="text-xs text-green-600">✓ Файл есть</span> : <span className="text-xs text-gray-400">Файл отсутствует</span>}
                    </div>
                    <button onClick={() => deleteMaterial(m.id)} className="text-red-500 text-sm hover:underline flex-shrink-0">Удалить</button>
                  </div>
                ))}
                {materials.length === 0 && <p className="text-gray-400 text-sm">Выберите предмет.</p>}
              </div>
            </div>
          </div>
        )}
        {/* === NEWS === */}
        {tab === 'news' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Опубликовать новость</h2>
              <form onSubmit={createNews} className="card p-4 space-y-3">
                <div><label className="label">Заголовок</label><input value={nForm.title} onChange={e => setNForm(p => ({ ...p, title: e.target.value }))} className="input" required /></div>
                <div><label className="label">Текст</label><textarea value={nForm.content} onChange={e => setNForm(p => ({ ...p, content: e.target.value }))} className="input" rows={5} required /></div>
                <button type="submit" className="btn-primary">Опубликовать</button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Новости</h2>
              <div className="flex flex-col gap-2">
                {news.map(n => (
                  <div key={n.id} className="card p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{n.title}</p></div>
                    <button onClick={() => deleteNews(n.id)} className="text-red-500 text-sm hover:underline flex-shrink-0">Удалить</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
