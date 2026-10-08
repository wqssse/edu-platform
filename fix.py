f = "src/app/(public)/courses/[course]/[semester]/page.tsx"
c = open(f, encoding="utf-8").read()
if "import { MaterialCategory }" not in c:
    open(f, "w", encoding="utf-8").write("import { MaterialCategory } from '@prisma/client'\n" + c)
    print("Done!")
else:
    print("Already there")