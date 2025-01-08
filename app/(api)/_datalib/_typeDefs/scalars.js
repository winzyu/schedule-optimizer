import gql from 'graphql-tag';

const typeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default typeDefs;
