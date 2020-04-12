const User = require('../../models/User')

module.exports = {
  Query: {
    getUsers: async (_, args, ctx) => {
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
  }
}
