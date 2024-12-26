// app/(api)/_datalib/_typeDefs/Course.js
import gql from 'graphql-tag';

export default gql`
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
    openSeats: Int!
    reservedSeats: Int!
    waitlistSeats: Int!
    meetings: [Meeting!]!
  }

  type Meeting {
    id: ID!
    time: String!
    days: String!
    type: String!
    location: String!
  }

  type Schedule {
    id: ID!
    name: String!
    courses: [Course!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CourseSearchInput {
    subjectCode: String!
    courseNumber: String!
  }

  extend type Query {
    courses(search: CourseSearchInput!): [Course!]!
    schedule(id: ID!): Schedule
    schedules: [Schedule!]!
  }

  extend type Mutation {
    createSchedule(name: String!): Schedule!
    addCourseToSchedule(scheduleId: ID!, courseId: ID!): Schedule!
    removeCourseFromSchedule(scheduleId: ID!, courseId: ID!): Schedule!
  }
`;
