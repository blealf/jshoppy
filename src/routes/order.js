import { Router } from 'express'
import orderController from '../controllers/orderControllers.js'

const router = Router()

router.get('/orders/:id', orderController.get_orders)
router.post('/orders/:id', orderController.checkout)

export default router