const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

const User = require('./models/User')
const { mongoDB } = require('./config')

const typeDefs = gql`
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

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo Connected')
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`)
    })
  })
