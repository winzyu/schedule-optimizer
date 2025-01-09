// app/lib/graphql/resolvers/Course.ts
const resolvers = {
  Query: {
    courses: async (_, { search }, { prisma }) => {
      console.log('Starting course search with criteria:', search);

      try {
        let whereClause: any = {};

        if (search.subjectCode || search.courseNumber) {
          whereClause = {
            AND: [],
          };

          if (search.subjectCode) {
            whereClause.AND.push({
              subjectCode: {
                equals: search.subjectCode.toUpperCase(),
                mode: 'insensitive',
              },
            });
          }

          if (search.courseNumber) {
            const normalizedNumber = search.courseNumber.replace(/^0+/, '');

            // If it's purely numeric (like "36"), match all series
            if (/^\d+$/.test(normalizedNumber)) {
              whereClause.AND.push({
                courseNumber: {
                  contains: normalizedNumber,
                  mode: 'insensitive',
                },
              });
            } else {
              // For numbers with letters (like "36A"), try all variations
              const match = normalizedNumber.match(/^(\d+)([A-Za-z]*)$/);
              if (match) {
                const [_, numPart, letterPart] = match;
                const variations = [
                  normalizedNumber, // e.g., "36A"
                  numPart.padStart(3, '0') + letterPart, // e.g., "036A"
                  numPart + letterPart, // e.g., "36A"
                ];

                whereClause.AND.push({
                  OR: variations.map((variant) => ({
                    courseNumber: {
                      equals: variant,
                      mode: 'insensitive',
                    },
                  })),
                });
              }
            }
          }
        }

        console.log('Where clause:', JSON.stringify(whereClause, null, 2));

        const courses = await prisma.course.findMany({
          where: whereClause,
          include: {
            meetings: true,
          },
          orderBy: [{ subjectCode: 'asc' }, { courseNumber: 'asc' }],
        });

        console.log(`Query executed, found ${courses.length} courses`);
        return courses;
      } catch (error) {
        console.error('Error in courses resolver:', error);
        throw error;
      }
    },
  },
};

export default resolvers;
