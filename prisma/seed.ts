import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  const pw = process.env.ADMIN_PASSWORD ?? 'admin123';
  const hash = await bcrypt.hash(pw, 10);
  await prisma.admin.upsert({
    where: { login: 'admin' },
    update: { passwordHash: hash },
    create: { login: 'admin', passwordHash: hash },
  });

  const course = await prisma.course.upsert({
    where: { number: 1 },
    update: { title: '1 курс' },
    create: { number: 1, title: '1 курс' },
  });
  const sem1 = await prisma.semester.upsert({
    where: { courseId_number: { courseId: course.id, number: 1 } },
    update: {},
    create: { courseId: course.id, number: 1 },
  });
  const sem2 = await prisma.semester.upsert({
    where: { courseId_number: { courseId: course.id, number: 2 } },
    update: {},
    create: { courseId: course.id, number: 2 },
  });

  const subjectsData = [
    { semesterId: sem1.id, title: 'Анатомия', slug: 'anatomy', description: 'Строение тела человека, органов и систем.' },
    { semesterId: sem1.id, title: 'Гистология', slug: 'histology', description: 'Наука о тканях живых организмов.' },
    { semesterId: sem2.id, title: 'Химия', slug: 'chemistry', description: 'Общая и неорганическая химия.' },
  ];

  type Cat = 'LECTURE' | 'TEXTBOOK' | 'METHODICAL' | 'ADDITIONAL' | 'EXAM_PREP';
  const catTitles: Record<Cat, string[]> = {
    LECTURE:    ['Лекция 1: Введение в предмет', 'Лекция 2: Основные понятия', 'Лекция 3: Практическое применение'],
    TEXTBOOK:   ['Учебник — Том 1', 'Учебник — Том 2'],
    METHODICAL: ['Методические указания к практическим занятиям', 'Руководство к лабораторным работам'],
    ADDITIONAL: ['Дополнительная литература', 'Справочные материалы'],
    EXAM_PREP:  ['Вопросы к экзамену', 'Тестовые задания для самопроверки'],
  };

  for (const sd of subjectsData) {
    const subj = await prisma.subject.upsert({
      where: { slug: sd.slug },
      update: { title: sd.title, description: sd.description },
      create: sd,
    });
    await prisma.material.deleteMany({ where: { subjectId: subj.id } });
    for (const cat of Object.keys(catTitles) as Cat[]) {
      for (let i = 0; i < catTitles[cat].length; i++) {
        await prisma.material.create({
          data: {
            subjectId: subj.id,
            category: cat,
            title: catTitles[cat][i],
            description: `${catTitles[cat][i]} по предмету «${sd.title}».`,
            filePath: null,
            fileType: 'pdf',
            order: i + 1,
          },
        });
      }
    }
  }

  await prisma.newsItem.deleteMany();
  await prisma.newsItem.createMany({
    data: [
      { title: 'Добро пожаловать на платформу!', content: 'Уважаемые студенты! Рады приветствовать вас. Здесь вы найдёте все учебные материалы для успешной учёбы.', createdAt: new Date('2024-09-01') },
      { title: 'Добавлены материалы по Анатомии', content: 'В раздел «Анатомия» загружены лекционные материалы, методические указания и вопросы к экзамену.', createdAt: new Date('2024-09-10') },
      { title: 'Обновление раздела «Гистология»', content: 'Добавлены новые лабораторные руководства и дополнительная литература.', createdAt: new Date('2024-09-20') },
    ],
  });

  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
