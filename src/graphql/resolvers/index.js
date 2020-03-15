const usersResolvers = require('./userResolvers')

module.exports = {
    Query: {
        ...usersResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation
    }
}