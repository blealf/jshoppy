import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
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

const checkout = async (req, res) => {
  const userId = req.params.id
  try {
    const cart = await Cart.findOne({ userId })
    if (cart) {
      const session = await Stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 500,
              product_data: {
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt',
                images: ['https://example.com/t-shirt.png'],
              },
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3002/order/success',
        cancel_url: 'http://localhost:3002/order/cancel'
      })
      res.redirect(303, session.url);
      if (!session) throw Error('Payment failed')
      if (session) {
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