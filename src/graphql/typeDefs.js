const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String
    points: Int
    purchases: Int
    sweeties: Int
    admin: Boolean
  }

  type Query {
    getUsers: [User]
    getPoints(email: String): User!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input UpdateInput {
    username: String
    password: String
    confirmPassword: String
    email: String
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    addPoints(email: String!, points: Int!): User!
    editProfile(email: String!, updateInput: UpdateInput): User
  }
`
