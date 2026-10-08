export type MaterialCategory = 'LECTURE' | 'TEXTBOOK' | 'METHODICAL' | 'ADDITIONAL' | 'EXAM_PREP';
export interface CategoryMeta { label: string; icon: string; color: string; bgColor: string; }
export const CATEGORY_META: Record<MaterialCategory, CategoryMeta> = {
  LECTURE:    { label: 'Лекции',                  icon: '📖', color: 'text-blue-700 dark:text-blue-300',   bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  TEXTBOOK:   { label: 'Учебники',                icon: '📚', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-50 dark:bg-purple-900/30' },
  METHODICAL: { label: 'Методические пособия',    icon: '📋', color: 'text-green-700 dark:text-green-300',  bgColor: 'bg-green-50 dark:bg-green-900/30' },
  ADDITIONAL: { label: 'Дополнительно',           icon: '🗂️', color: 'text-orange-700 dark:text-orange-300', bgColor: 'bg-orange-50 dark:bg-orange-900/30' },
  EXAM_PREP:  { label: 'Подготовка к экзамену',   icon: '✏️', color: 'text-red-700 dark:text-red-300',     bgColor: 'bg-red-50 dark:bg-red-900/30' },
};
export const ALL_CATEGORIES = Object.keys(CATEGORY_META) as MaterialCategory[];
