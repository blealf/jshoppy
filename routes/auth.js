import { Router } from 'express'
import authController from '../controllers/authControllers.js'
import auth from '../middleware/auth.js'

const router = Router()

router.post('/register', authController.signup)
router.post('/login', authController.login)
router.get('/user', authController.get_user)

// module.exports = router
export default router