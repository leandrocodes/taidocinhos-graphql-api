const User = require('../../models/User')

module.exports = {
  Query: {
    async getUsers(_, args, ctx) {
      if (!ctx.user || !ctx.user.admin == true) return null
      else {
        try {
          const users = await User.find({ admin: false })
          return users
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  },
  Mutation: {
    async addPoints(_, { email, points }, ctx) {
      if (!ctx.user || !ctx.user.admin == true) return null
      else {
        try {
          const user = await User.findOne({ email })
          user.points += points
          user.save()
          return user
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
}
