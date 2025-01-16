import gql from 'graphql-tag';

const typeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;

export default typeDefs;
