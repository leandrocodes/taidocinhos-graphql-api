const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const mongoDB = process.env.MONGO_HOST
const secretKey = process.env.secretKey
const User = require('./models/User')

async function getUser(token) {
  const signedToken = jwt.verify(token, secretKey)
  const _id = signedToken.id
  const user = await User.findOne({ _id }).lean()
  return user
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || ''
    if (!token || token == '') return
    const user = await getUser(token)
    return { user }
  },
  introspection: true
})

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo Connected')
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`)
    })
  })
