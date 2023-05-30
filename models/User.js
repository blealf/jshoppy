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
  register_date: {
    type: Date,
    default: Date.now
  }
})

// module.exports = User = mongoose.model('user', UserSchema)
export default mongoose.model('user', UserSchema)