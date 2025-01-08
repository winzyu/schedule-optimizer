import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getUser } from './_middleware/auth.js';
import typeDefs from './_typeDefs/index.js';
import resolvers from './_resolvers/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

export default startServerAndCreateNextHandler(server, {
  context: async (req) => ({
    user: await getUser(req),
  }),
});
