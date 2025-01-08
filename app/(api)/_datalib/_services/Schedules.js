import prisma from '../_prisma/client.js';

export default class Schedules {
  // CREATE
  static async create({ userId, input }) {
    const schedule = await prisma.schedule.create({
      data: {
        ...input,
        userId
      }
    });
    return schedule;
  }

  // READ
  static async find({ id }) {
    return prisma.schedule.findUnique({ 
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              include: {
                meetings: true
              }
            }
          }
        }
      }
    });
  }

  static async findAll() {
    return prisma.schedule.findMany();
  }

  static async findByUser({ userId }) {
    return prisma.schedule.findMany({
      where: { userId },
      include: {
        courses: {
          include: {
            course: {
              include: {
                meetings: true
              }
            }
          }
        }
      }
    });
  }

  // DELETE
  static async delete({ id }) {
    try {
      await prisma.schedule.delete({
        where: { id }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // SCHEDULE-COURSE OPERATIONS
  static async addCourse({ scheduleId, courseId }) {
    // Check for time conflicts
    const schedule = await this.find({ id: scheduleId });
    const newCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { meetings: true }
    });

    const hasConflict = this.checkTimeConflicts(
      schedule.courses.map(sc => sc.course),
      newCourse
    );

    if (hasConflict) {
      throw new Error('Course has time conflict with existing courses');
    }

    await prisma.scheduleToCourse.create({
      data: {
        scheduleId,
        courseId
      }
    });

    return this.find({ id: scheduleId });
  }

  static async removeCourse({ scheduleId, courseId }) {
    await prisma.scheduleToCourse.delete({
      where: {
        scheduleId_courseId: {
          scheduleId,
          courseId
        }
      }
    });

    return this.find({ id: scheduleId });
  }

  static async getCourses({ id }) {
    const coursesWithConnections = await prisma.scheduleToCourse.findMany({
      where: { scheduleId: id },
      include: {
        course: {
          include: {
            meetings: true
          }
        }
      }
    });

    return coursesWithConnections.map(connection => connection.course);
  }

  // UTILITY FUNCTIONS
  static checkTimeConflicts(existingCourses, newCourse) {
    const newMeetings = newCourse.meetings;
    
    for (const existingCourse of existingCourses) {
      for (const existingMeeting of existingCourse.meetings) {
        for (const newMeeting of newMeetings) {
          if (this.meetingsOverlap(existingMeeting, newMeeting)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static meetingsOverlap(meeting1, meeting2) {
    // Check if days overlap
    const days1 = meeting1.days.split('');
    const days2 = meeting2.days.split('');
    const commonDays = days1.filter(day => days2.includes(day));
    
    if (commonDays.length === 0) return false;

    // Parse time strings (assuming format like "0800-0950")
    const [start1, end1] = meeting1.time.split('-').map(t => parseInt(t));
    const [start2, end2] = meeting2.time.split('-').map(t => parseInt(t));

    // Check if times overlap
    return !(end1 <= start2 || end2 <= start1);
  }
}
