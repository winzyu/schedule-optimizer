// app/lib/graphql/schema/Course.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  type Course {
    id: ID!
    crn: String!
    subjectCode: String!
    courseNumber: String!
    sectionCode: String!
    title: String!
    units: Int!
    instructor: String!
    description: String
    geCourses: [String!]!
    finalExam: DateTime
    dropDate: String
    openSeats: Int
    reservedSeats: Int
    waitlistSeats: Int
    meetings: [Meeting!]!
  }

  input CourseSearchInput {
    subjectCode: String
    courseNumber: String
  }

  type Query {
    course(id: ID!): Course
    courses(search: CourseSearchInput): [Course!]!
  }
`;

export default typeDefs;
