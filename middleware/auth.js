import config from 'config'
import jwt from 'jsonwebtoken'
import { responseObject } from '../utils/helpers.js'

const auth = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return responseObject(res, {
      status: 400,
      data: {
        msg: 'No token, authorization denied'
      }
    })
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtsecret'))
    req.user = decoded
  } catch (error) {
    return responseObject(res, {
      status: 400,
      data: {
        msg: 'Token is not valid'
      }
    })
  }
}



export default auth