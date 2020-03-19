const usersResolvers = require('./usersResolvers')

module.exports = {
    Query: {
        ...usersResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation
    }
}