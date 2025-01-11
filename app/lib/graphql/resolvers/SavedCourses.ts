// app/lib/graphql/resolvers/SavedCourses.ts
const resolvers = {
  Query: {
    savedCourses: async (_, { userId }, { prisma }) => {
      console.log('Querying saved courses for user:', userId);
      const savedCourses = await prisma.savedCourses.findUnique({
        where: { userId },
        include: {
          courses: {
            include: {
              meetings: true,
            },
          },
        },
      });
      console.log('Found saved courses:', savedCourses);
      return savedCourses?.courses || [];
    },
  },
  Mutation: {
    saveCourse: async (_, { userId, courseId }, { prisma }) => {
      console.log(
        'Attempting to save course. UserId:',
        userId,
        'CourseId:',
        courseId
      );
      try {
        // First check if user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        console.log('Found user:', user);

        if (!user) {
          throw new Error(`User not found with ID ${userId}`);
        }

        // Check if course exists
        const course = await prisma.course.findUnique({
          where: { id: courseId },
        });
        console.log('Found course:', course);

        if (!course) {
          throw new Error(`Course not found with ID ${courseId}`);
        }

        // Now try to save the course
        const savedCourses = await prisma.savedCourses.upsert({
          where: { userId },
          create: {
            userId,
            courses: {
              connect: { id: courseId },
            },
          },
          update: {
            courses: {
              connect: { id: courseId },
            },
          },
          include: {
            courses: {
              include: {
                meetings: true,
              },
            },
          },
        });

        console.log('Saved courses result:', savedCourses);
        const savedCourse = savedCourses.courses.find(
          (course) => course.id === courseId
        );
        console.log('Returning saved course:', savedCourse);

        if (!savedCourse) {
          throw new Error('Failed to save course');
        }

        return savedCourse;
      } catch (error) {
        console.error('Error in saveCourse resolver:', error);
        throw error;
      }
    },
    removeSavedCourse: async (_, { userId, courseId }, { prisma }) => {
      console.log(
        'Removing saved course. UserId:',
        userId,
        'CourseId:',
        courseId
      );
      try {
        await prisma.savedCourses.update({
          where: { userId },
          data: {
            courses: {
              disconnect: { id: courseId },
            },
          },
        });
        return true;
      } catch (error) {
        console.error('Error removing saved course:', error);
        throw error;
      }
    },
  },
};

export default resolvers;
