import jwt from 'jsonwebtoken'
import config from 'config'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { responseObject } from '../utils/helpers.js'

const handleFieldError = (values) => {
  const errorMessage = {
    name: 'Please enter name',
    email: 'Please enter email',
    password: 'Please enter password',
    userExists: 'User already exists'
  }
  values.forEach((value) => {
    if (!value) return responseObject(res, {status: 400, data: {
      msg: errorMessage[`${value}`]
    }})
  })
}

const hashPassword = ({ newUser, password, res }) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if(err) return console.log(err)
    newUser.password = hash
    newUser.save().then((user) => signUser(user, res))
  })
}

const signUser = (user, res, isSignup = true) => {
  jwt.sign(
    { id: user._id },
    config.get('jwtSecret'),
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err
      const data = {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
     responseObject(res, { status: isSignup ? 201 : 200, data})
    }
  )
}

// Signup
const signup = async (req, res) => {
  const { name, email, password } = req.body

  const values = [name, email, password]
  handleFieldError(values)

  const user = await User.findOne({ email })
  console.log({ user })
  if (user) {
    return responseObject(res, {status: 400, data: {
      msg: errorMessage.userExists
    }})
  }
  const newUser = new User({ name, email, password })
  hashPassword({ newUser, password, res })
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body

  const values = [email, password]
  handleFieldError(values)

  const user = await User.findOne({ email })
  if (!user) return responseObject(res, { status: 400, data: {
    msg: 'User does not exist'
  }})

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return responseObject(res, { status: 400, data: {
    msg: 'invalid credential'
  }
  })
  signUser(user, res, false)
}

// getUser
const get_user = async (req, res) => {
  const user = await User.findById(req.body.id).select('-password')
  if (!user) return responseObject(res, { status: 400, data: {
    msg: 'User does not exist'
  }})
  res.status(200).json(user)
}

export default { signup, login, get_user }