// app/lib/graphql/schema/Schedule.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  type Schedule {
    id: ID!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    courses: [Course!]!
    userId: String!
  }

  input CreateScheduleInput {
    name: String!
    courseIds: [ID!]!
    userId: String! # Temporary until auth is implemented
  }

  input UpdateScheduleInput {
    id: ID!
    name: String
    courseIds: [ID!]
  }

  extend type Query {
    schedules(userId: String!): [Schedule!]!
    schedule(id: ID!): Schedule
  }

  extend type Mutation {
    createSchedule(input: CreateScheduleInput!): Schedule!
    updateSchedule(input: UpdateScheduleInput!): Schedule!
    deleteSchedule(id: ID!): Boolean!
  }
`;

export default typeDefs;
