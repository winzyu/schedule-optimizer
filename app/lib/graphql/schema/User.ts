// app/lib/graphql/schema/User.ts
import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    email: String!
    name: String!
    password: String!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;

export default typeDefs;
