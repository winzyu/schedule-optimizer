import Users from '../_services/Users.js';
import { hashPassword, comparePasswords, generateToken } from '../_utils/auth.js';

const resolvers = {
  User: {
    schedules: ({ id }) => Users.getSchedules({ id }),
  },
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Users.find({ id: user.id });
    },
    user: (_, { id }) => Users.find({ id }),
  },
  Mutation: {
    signUp: async (_, { input }) => {
      const hashedPassword = await hashPassword(input.password);
      const user = await Users.create({
        input: { ...input, password: hashedPassword },
      });
      const token = generateToken(user);
      return { token, user };
    },
    login: async (_, { input }) => {
      const user = await Users.findByEmail({ email: input.email });
      if (!user) throw new Error('Invalid credentials');
      
      const isValid = await comparePasswords(input.password, user.password);
      if (!isValid) throw new Error('Invalid credentials');
      
      const token = generateToken(user);
      return { token, user };
    },
    updateUser: async (_, { id, input }, { user }) => {
      if (!user || user.id !== id) throw new Error('Not authorized');
      if (input.password) {
        input.password = await hashPassword(input.password);
      }
      return Users.update({ id, input });
    },
    deleteUser: async (_, { id }, { user }) => {
      if (!user || user.id !== id) throw new Error('Not authorized');
      return Users.delete({ id });
    },
  },
};

export default resolvers;
