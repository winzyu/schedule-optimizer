// app/lib/graphql/resolvers/User.ts
const resolvers = {
  Query: {
    users: async (_, __, { prisma }) => {
      return prisma.user.findMany();
    },
    user: async (_, { id }, { prisma }) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createUser: async (_, { input }, { prisma }) => {
      const { email, name, password } = input;

      // First check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error(`User with email ${email} already exists`);
      }

      return prisma.user.create({
        data: {
          email,
          name,
          password, // Note: In production, this should be hashed
        },
      });
    },
  },
  // Add field resolver for schedules
  User: {
    schedules: async (parent, _, { prisma }) => {
      return prisma.schedule.findMany({
        where: { userId: parent.id },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });
    },
  },
};

export default resolvers;
