const usersResolvers = require('./userResolvers')

module.exports = {
    Query: {
        ...usersResolvers.Query
    }
}