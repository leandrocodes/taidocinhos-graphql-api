import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type Query {
    users: [User]
  }
  type Admin {
    id: ID!
    username: String!
    admin: boolean!
  }
`

const users = [
  {
    id: '123',
    username: 'J.K. Rowling'
  },
  {
    id: '321',
    username: 'Michael Crichton'
  }
]

const resolvers = {
  Query: {
    users: () => users
  }
}

const server = new ApolloServer({ 
  typeDefs, 
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
