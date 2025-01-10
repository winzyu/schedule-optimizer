const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseDateTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toISOString();
}

async function importCourses() {
  try {
    await prisma.meeting.deleteMany();
    await prisma.course.deleteMany();
    console.log('Cleared existing data');

    const coursesPath = path.join(__dirname, '../data/courses.json');
    const subjectData = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    const allCourses = Object.values(subjectData).flat();

    console.log(`Found ${allCourses.length} courses to import`);

    const batchSize = 100;
    for (let i = 0; i < allCourses.length; i += batchSize) {
      const batch = allCourses.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (courseData) => {
          const { meetings, availability, finalExam, ...courseFields } =
            courseData;

          await prisma.course.create({
            data: {
              ...courseFields,
              finalExam: parseDateTime(finalExam),
              openSeats: availability.open,
              reservedSeats: availability.reserved,
              waitlistSeats: availability.waitlist,
              meetings: {
                create: meetings.map((meeting) => ({
                  time: meeting.time,
                  days: meeting.days,
                  type: meeting.type,
                  location: meeting.location,
                })),
              },
            },
          });
        })
      );

      console.log(
        `Imported ${Math.min(i + batchSize, allCourses.length)}/${
          allCourses.length
        } courses`
      );
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing courses:', error);
    console.error('Sample data:', error.meta?.cause);
  } finally {
    await prisma.$disconnect();
  }
}

importCourses();
