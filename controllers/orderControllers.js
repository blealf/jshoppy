import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import User from '../models/User.js'
import stripe from 'stripe'
import config from 'config'
import { responseObject } from '../utils/helpers.js'

const Stripe = stripe(config.get('stripeapikey'))
const get_orders = async (req, res) => {
  const userId = req.params.id

  try {
    const orders = await Order.find({ userId }).sort({date: -1})
      responseObject(res, {
        status: 200,
        data: { orders}
      })
  } catch (error) {
    console.log(error)
    responseObject(res, {
      status: 500,
      data: { msg: 'An Error occurred' }
    })
  }
}

const checkout = async () => {
  const userId = req.params.id
  const { source } = req.body
  try {
    const cart = Cart.findOne({ userId })
    const user = User.findOne({ _id: userId })
    const email = user.email
    if (cart) {
      const charge = await stripe.ChargesResource.create({
        amount: cart.bill,
        currency: 'usd',
        source,
        receipt_email: email
      })
      if (!charge) throw Error('Payment failed')
      if (charge) {
        const order = await Order.create({
          userId,
          items: cart.items,
          bill: cart.bill
        })
        await Cart.findByIdAndDelete({ _id: cart.id })
        responseObject(res, {
          status: 201,
          data: { order }
        })
      }
    }
  } catch (error) {
    console.log(error)
    responseObject(res, {
      status: 500,
      data: { msg: 'You do not have items in cart' }
    })
  }
}

export default {
  get_orders,
  checkout
}