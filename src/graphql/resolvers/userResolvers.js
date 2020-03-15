const User = require('../../models/User')

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    register(_, args, ctx, info) {
      // TODO: Validate user data
      // TODO: Make sure user is unique
      // TODO: Hash password and auth token
    }
  }
}
