const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  points: Number,
  purchases: Number,
  sweeties: Number,
  admin: Boolean
})

module.exports = model('User', userSchema)
