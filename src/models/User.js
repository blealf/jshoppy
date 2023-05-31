import mongoose from 'mongoose'
const Schema = mongoose.Schema
import validator from 'validator'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minLength: [6, 'Minimum password length must be 6characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
})

UserSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date()
  }
  next()
})

export default mongoose.model('user', UserSchema)