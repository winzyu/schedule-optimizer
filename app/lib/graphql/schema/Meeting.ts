// app/lib/graphql/schema/Meeting.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  type Meeting {
    id: ID!
    time: String!
    days: String!
    type: String!
    location: String!
    courseId: String!
  }
`;

export default typeDefs;
