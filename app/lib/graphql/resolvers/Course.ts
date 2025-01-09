// app/lib/graphql/resolvers/Course.ts
const resolvers = {
  Query: {
    courses: async (_, { search }, { prisma }) => {
      console.log('Starting course search with criteria:', search);

      try {
        // Build the where clause
        let whereClause: any = {};
        
        if (search.subjectCode || search.courseNumber) {
          whereClause = {
            AND: []
          };
          
          if (search.subjectCode) {
            whereClause.AND.push({
              subjectCode: {
                equals: search.subjectCode.toUpperCase(),
                mode: 'insensitive'
              }
            });
          }
          
          if (search.courseNumber) {
            whereClause.AND.push({
              courseNumber: {
                equals: search.courseNumber,
                mode: 'insensitive'
              }
            });
          }
        }

        console.log('Where clause:', JSON.stringify(whereClause, null, 2));

        // Execute query with debug logging
        const startTime = Date.now();
        const courses = await prisma.course.findMany({
          where: whereClause,
          include: {
            meetings: true
          },
          orderBy: {
            subjectCode: 'asc'
          },
          // Remove take limit for now
        });
        const endTime = Date.now();

        console.log(`Query executed in ${endTime - startTime}ms`);
        console.log(`Found ${courses.length} courses`);
        
        if (courses.length > 0) {
          // Log first result as sample
          console.log('Sample result:', {
            id: courses[0].id,
            subjectCode: courses[0].subjectCode,
            courseNumber: courses[0].courseNumber,
            title: courses[0].title
          });
        }

        return courses;
      } catch (error) {
        console.error('Error in courses resolver:', error);
        throw error;
      }
    },
  },
  Course: {
    meetings: ({ id }, _, { prisma }) => {
      return prisma.meeting.findMany({
        where: { courseId: id },
      });
    },
  },
};

export default resolvers;
