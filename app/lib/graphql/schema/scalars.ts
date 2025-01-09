// app/lib/graphql/schema/scalars.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  scalar DateTime
  
  # Empty types to extend
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default typeDefs;
