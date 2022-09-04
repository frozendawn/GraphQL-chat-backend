const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConfirm: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function (next) {
  if (this.password !== this.passwordConfirm) {
    const err = new Error('Password validation failed');
    return next(err);
  }
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 12)
  next();
})

module.exports = new mongoose.model('User', userSchema);