const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators')
const { secretKey } = require('../../config')
const User = require('../../models/User')

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
    },
    secretKey,
    { expiresIn: `1h` }
  )
  return token
}

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
    },
  },
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      )
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      const user = await User.findOne({ email })
      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'Email already in usage',
          },
        })
      }
      password = await bcrypt.hash(password, 12)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toUTCString(),
        admin: false,
        points: 0,
      })
      const res = await newUser.save()

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token,
      }
    },
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password)
      const user = await User.findOne({ email })

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      if (!user) {
        errors.general = 'Usuário não encontrado'
        throw new UserInputError('Email não cadastrado', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Email ou senha não coincidem'
        throw new UserInputError('Email ou senha errados', { errors })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },
  },
}
