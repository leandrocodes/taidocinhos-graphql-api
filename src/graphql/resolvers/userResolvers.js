const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

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
    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      // TODO: Validate user data
      const user = await User.findOne({ email })
      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'Email already in usage'
          }
        })
      }
      password = await bcrypt.hash(password, 12)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toUTCString()
      })
      const res = await newUser.save()

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username
        },
        secretKey,
        { expiresIn: `1h` }
      )

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
