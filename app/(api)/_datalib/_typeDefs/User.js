import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    schedules: [Schedule!]!
  }

  input UserCreateInput {
    email: String!
    name: String!
    password: String!
  }

  input UserUpdateInput {
    email: String
    name: String
    password: String
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User               # Get the current logged-in user
    user(id: ID!): User   # Get a specific user by ID
  }

  type Mutation {
    # Auth mutations
    signUp(input: UserCreateInput!): AuthPayload!
    login(input: UserLoginInput!): AuthPayload!
    
    # User mutations
    updateUser(id: ID!, input: UserUpdateInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

export default typeDefs;
