// app/lib/graphql/schema/SavedCourses.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  type SavedCourses {
    userId: String!
    courses: [Course!]!
  }

  extend type Query {
    savedCourses(userId: String!): [Course!]!
  }

  extend type Mutation {
    saveCourse(userId: String!, courseId: String!): Course!
    removeSavedCourse(userId: String!, courseId: String!): Boolean!
  }
`;

export default typeDefs;
