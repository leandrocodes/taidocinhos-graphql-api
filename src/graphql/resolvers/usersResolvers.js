const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
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
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
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
  },
  async login(_, { email, password }) {
    const { errors, valid } = validateLoginInput(email, password)
    const user = await User.findOne({ username })

    if (!user) {
      errors.general = 'Usuário não encontrado'
      throw new UserInputError('Email não cadastrado', { errors })
    }
  }
}
