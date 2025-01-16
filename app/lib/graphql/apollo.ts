import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

// Auth link to include the token in requests
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        courses: {
          merge(existing = [], incoming) {
            return incoming; // For search results, we want to replace not merge
          },
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
  link: from([authLink, httpLink]),
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
