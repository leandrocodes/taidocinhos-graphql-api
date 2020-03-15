const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String
  }

  type Query {
    getUsers: [User]
  }
`