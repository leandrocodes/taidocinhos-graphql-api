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
    async addPoints(_, { email, sweeties }, ctx) {
      if (!ctx.user || !ctx.user.admin == true)
        throw new Error('Você não está autorizado a fazer isso!')
      else {
        try {
          const user = await User.findOne({ email })
          user.sweeties += sweeties
          user.points = Math.floor(user.sweeties / 3)

          if (user.sweeties > 30) {
            user.sweeties -= 30
            user.points -= 10
            user.bonuses++
          }

          if (user.sweeties == 30) user.bonuses++
          user.save()
          return user
        } catch (err) {
          throw new Error(err)
        }
      }
    },
    async retrievePoints(_, { email }, ctx) {
      if (!ctx.user || !ctx.user.admin == true)
        throw new Error('Você não está autorizado a fazer isso!')
      else {
        try {
          const user = await User.findOne({ email })
          if (user.sweeties < 30 && user.bonuses < 1)
            throw new Error(`Usuário ainda não tem pontos suficientes para resgatar.`)

          if (user.sweeties == 30) {
            user.sweeties -= 30
            user.points -= 10
            user.bonuses--
          }

          if (user.sweeties < 30 && user.bonuses > 0) user.bonuses--
          user.save()
          return user
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
}
