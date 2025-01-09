// app/api/graphql/route.ts
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';
import schema from '@/lib/graphql/schema';
import resolvers from '@/lib/graphql/resolvers';
import { prisma } from '@/lib/prisma/client';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async () => ({ prisma }),
});

export async function POST(req: NextRequest) {
  try {
    return await handler(req);
  } catch (error) {
    console.error('GraphQL Error:', error);
    return new Response(
      JSON.stringify({
        errors: [{ message: 'Internal server error' }],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export { handler as GET };
