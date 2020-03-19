const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String
  }

  type Query {
    getUsers: [User]
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
  }
`
