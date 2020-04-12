const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { mongoDB } = require('./config')
const { secretKey } = require('./config')
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
})

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo Connected')
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`)
    })
  })
