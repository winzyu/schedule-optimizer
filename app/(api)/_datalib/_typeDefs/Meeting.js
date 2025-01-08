import gql from 'graphql-tag';

const typeDefs = gql`
  type Meeting {
    id: ID!
    time: String!
    days: String!
    type: String!
    location: String!
    course: Course!
  }
`;

export default typeDefs;
