const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { secretKey } = require('../../config')
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
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      ctx,
      info
    ) {
      // TODO: Validate user data
      // TODO: Make sure user is unique
      password = await bcrypt.hash(password, 12)
      const user = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })
      const res = await user.save()

      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, secretKey, { expiresIn: `1h` })

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
