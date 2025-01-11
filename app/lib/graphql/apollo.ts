// app/lib/graphql/apollo.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        courses: {
          merge(existing = [], incoming) {
            return incoming; // For search results, we want to replace not merge
          },
          // Add keyArgs to properly cache different search queries
          keyArgs: ['search', ['subjectCode', 'courseNumber']],
        },
      },
    },
    Course: {
      keyFields: ['id'],
      fields: {
        meetings: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
