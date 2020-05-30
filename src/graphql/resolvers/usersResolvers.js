const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput
} = require('../../util/validators')
const { secretKey } = require('../../config')
const User = require('../../models/User')

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id
    },
    secretKey,
    { expiresIn: `1h` }
  )
  return token
}

module.exports = {
  Query: {
    async getPoints(_, { email }, ctx) {
      if (ctx.user.email === email || ctx.user.admin) {
        try {
          const user = await User.findOne({ email })
          return {
            ...user._doc,
            id: user._id
          }
        } catch (err) {
          throw new Error(err)
        }
      } else throw new Error('Você não está autorizado a fazer isso!')
    }
  },

  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
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
            email: 'Email already in usage'
          }
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
        purchases: 0,
        sweeties: 0
      })
      const res = await newUser.save()

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token
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
        token
      }
    },

    async editProfile(_, { email, updateInput }, ctx) {
      const user = await User.findOne({ email }).lean()
      // TODO: Melhorar essa verificação - MUITOS IFS!!
      // TODO: Receber a senha como parametro também (melhroar a segurança)
      if (ctx.user.mail === email || ctx.user.admin === true) {
        const userToUpdate = new User({ ...user })

        if (user) {
          if (updateInput.confirmPassword != updateInput.password)
            throw new Error('Senhas não coincidem!')
          else updateInput.password = await bcrypt.hash(updateInput.password, 12)

          if (updateInput.email) {
            const { errors, valid } = validateUpdateInput(updateInput.email)

            if (!valid) {
              throw new UserInputError('Errors', { errors })
            } else {
              const emailExists = await User.findOne({ email: updateInput.email }).lean()

              if (!emailExists) {
                await userToUpdate.updateOne({ ...updateInput }).lean()
                const updatedUser = await User.findOne({
                  email: updateInput.email
                }).lean()
                return {
                  ...updatedUser,
                  id: updatedUser._id
                }
              } else {
                throw new Error('Email já cadastrado!')
              }
            }
          } else {
            await userToUpdate.updateOne({ ...updateInput }).lean()
            const updatedUser = await User.findOne({ email }).lean()
            return {
              ...updatedUser,
              id: updatedUser._id
            }
          }
        } else throw new Error('Usuário não encontrado ou não existe.')
      } else throw new Error('Você não está autorizado a fazer isso!')
    }
  }
}
