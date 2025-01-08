// app/(api)/_datalib/_services/Courses.js
import prisma from '../_prisma/client.js';

export default class Courses {
  static async findByCriteria(search) {
    console.log('Searching for courses with criteria:', search);

    try {
      const courses = await prisma.course.findMany({
        where: {
          AND: [
            { subjectCode: search.subjectCode },
            { courseNumber: search.courseNumber },
          ],
        },
        include: {
          meetings: true,
        },
      });

      console.log('Found courses:', courses);
      return courses;
    } catch (error) {
      console.error('Error finding courses:', error);
      throw error;
    }
  }

  // RELATIONSHIPS
  static async getMeetings({ id }) {
    return prisma.meeting.findMany({
      where: { courseId: id },
    });
  }

  static async getSchedules({ id }) {
    const scheduleConnections = await prisma.scheduleToCourse.findMany({
      where: { courseId: id },
      select: { scheduleId: true },
    });

    return prisma.schedule.findMany({
      where: {
        id: {
          in: scheduleConnections.map((conn) => conn.scheduleId),
        },
      },
    });
  }

  static async listAllSubjectCodes() {
    const courses = await prisma.course.findMany({
      select: {
        subjectCode: true,
      },
      distinct: ['subjectCode'],
    });
    console.log(
      'Available subject codes:',
      courses.map((c) => c.subjectCode)
    );
    return courses.map((c) => c.subjectCode);
  }

  static async listAllCourseNumbers(subjectCode) {
    const courses = await prisma.course.findMany({
      where: {
        subjectCode,
      },
      select: {
        courseNumber: true,
      },
    });
    console.log(
      `Available course numbers for ${subjectCode}:`,
      courses.map((c) => c.courseNumber)
    );
    return courses.map((c) => c.courseNumber);
  }
}
