-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "crn" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "courseNumber" TEXT NOT NULL,
    "sectionCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "instructor" TEXT NOT NULL,
    "description" TEXT,
    "geCourses" TEXT[],
    "finalExam" TIMESTAMP(3),
    "dropDate" TEXT,
    "openSeats" INTEGER DEFAULT 0,
    "reservedSeats" INTEGER DEFAULT 0,
    "waitlistSeats" INTEGER DEFAULT 0,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleToCourse" (
    "scheduleId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "ScheduleToCourse_pkey" PRIMARY KEY ("scheduleId","courseId")
);

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleToCourse" ADD CONSTRAINT "ScheduleToCourse_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleToCourse" ADD CONSTRAINT "ScheduleToCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
