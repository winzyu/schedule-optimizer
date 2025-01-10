-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleToCourse" DROP CONSTRAINT "ScheduleToCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleToCourse" DROP CONSTRAINT "ScheduleToCourse_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleToCourse" ADD CONSTRAINT "ScheduleToCourse_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleToCourse" ADD CONSTRAINT "ScheduleToCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
