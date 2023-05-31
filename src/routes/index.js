import authRouter from './auth.js'
import itemRouter from './item.js'
import cartRouter from './cart.js'
import orderRouter from './order.js'

const router = (app) => {
  app.use(authRouter)
  app.use(itemRouter)
  app.use(cartRouter)
  app.use(orderRouter)
}

export default router