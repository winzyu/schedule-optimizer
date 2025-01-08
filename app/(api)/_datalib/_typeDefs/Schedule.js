import gql from 'graphql-tag';

const typeDefs = gql`
  type Schedule {
    id: ID!
    name: String!
    courses: [Course!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!           # Added user relationship
  }

  input ScheduleInput {
    name: String!
  }

  type Query {
    schedule(id: ID!): Schedule
    schedules: [Schedule!]!
    mySchedules: [Schedule!]!  # New query to get current user's schedules
  }

  type Mutation {
    createSchedule(input: ScheduleInput!): Schedule!
    addCourseToSchedule(scheduleId: ID!, courseId: ID!): Schedule!
    removeCourseFromSchedule(scheduleId: ID!, courseId: ID!): Schedule!
    deleteSchedule(id: ID!): Boolean!
    shareSchedule(scheduleId: ID!, userId: ID!): Boolean!  # Optional: for sharing schedules
  }
`;

export default typeDefs;
