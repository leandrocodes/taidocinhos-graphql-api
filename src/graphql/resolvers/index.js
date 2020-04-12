const usersResolvers = require('./usersResolvers')
const adminResolvers = require('./adminResolvers')

module.exports = {
  Query: {
  	...usersResolvers.Query,
    ...adminResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation
  }
}
