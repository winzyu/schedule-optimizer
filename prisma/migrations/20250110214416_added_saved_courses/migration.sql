-- CreateTable
CREATE TABLE "SavedCourses" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedCourses_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "_SavedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SavedCourses_AB_unique" ON "_SavedCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedCourses_B_index" ON "_SavedCourses"("B");

-- AddForeignKey
ALTER TABLE "SavedCourses" ADD CONSTRAINT "SavedCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedCourses" ADD CONSTRAINT "_SavedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedCourses" ADD CONSTRAINT "_SavedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "SavedCourses"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
