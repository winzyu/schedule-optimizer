// app/lib/graphql/resolvers/Schedule.ts
const resolvers = {
  Query: {
    schedules: async (_, { userId }, { prisma }) => {
      return prisma.schedule.findMany({
        where: { userId },
        include: {
          courses: {
            include: {
              course: {
                include: {
                  meetings: true,
                },
              },
            },
          },
        },
      });
    },
    schedule: async (_, { id }, { prisma }) => {
      return prisma.schedule.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              course: {
                include: {
                  meetings: true,
                },
              },
            },
          },
        },
      });
    },
  },
  Mutation: {
    createSchedule: async (_, { input }, { prisma }) => {
      const { name, courseIds, userId } = input;

      return prisma.schedule.create({
        data: {
          name,
          userId,
          courses: {
            create: courseIds.map((courseId) => ({
              course: {
                connect: { id: courseId },
              },
            })),
          },
        },
        include: {
          courses: {
            include: {
              course: {
                include: {
                  meetings: true,
                },
              },
            },
          },
        },
      });
    },
    updateSchedule: async (_, { input }, { prisma }) => {
      const { id, name, courseIds } = input;

      if (courseIds) {
        // First delete existing relationships
        await prisma.scheduleToCourse.deleteMany({
          where: { scheduleId: id },
        });
      }

      return prisma.schedule.update({
        where: { id },
        data: {
          name,
          ...(courseIds && {
            courses: {
              create: courseIds.map((courseId) => ({
                course: {
                  connect: { id: courseId },
                },
              })),
            },
          }),
        },
        include: {
          courses: {
            include: {
              course: {
                include: {
                  meetings: true,
                },
              },
            },
          },
        },
      });
    },
    deleteSchedule: async (_, { id }, { prisma }) => {
      // First delete all associated ScheduleToCourse records
      await prisma.scheduleToCourse.deleteMany({
        where: { scheduleId: id },
      });

      // Then delete the schedule
      await prisma.schedule.delete({
        where: { id },
      });

      return true;
    },
  },
  // Field resolvers to handle the nested data structure
  Schedule: {
    courses: (parent) => {
      return parent.courses.map((schedToCourse) => schedToCourse.course);
    },
    user: async (parent, _, { prisma }) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};

export default resolvers;
