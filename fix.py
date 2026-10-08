f = "src/app/(public)/courses/[course]/[semester]/page.tsx"
with open(f, encoding="utf-8") as file:
    c = file.read()
c = c.replace(
    "import { MaterialCategory } from '@prisma/client'\n", ""
).replace(
    "Partial<Record<MaterialCategory, number>>",
    "Partial<Record<string, number>>"
)
with open(f, "w", encoding="utf-8") as file:
    file.write(c)
print("Fixed!")