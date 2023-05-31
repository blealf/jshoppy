import Cart from '../models/Cart.js'
import Item from '../models/Item.js'
import { responseObject, calculateTotalCartBill } from '../utils/helpers.js'

const get_cart_items = async (req, res) => {
  const userId = req.params.id
  try {
    const cart = await Cart.findOne({ userId })
    if (cart && cart.items.length > 0) {
      responseObject(res, {
        status: 200,
        data: { cart }
      })
    } else {
      responseObject(res, {
        status: 200,
        data: { }
      })
    }
  } catch (error) {
    console.log(error)
    responseObject(res, {
        status: 500,
        data: {
          msg: 'Something went wrong'
        }
      })
  }
}


const add_cart_item = async (req, res) => {
  const userId = req.params.id
  const { productId, quantity } = req.body
  try {
    let cart = await Cart.findOne({ userId })
    let item = await Item.findOne({ _id: productId })
    if (!item) {
      responseObject(res, {
        status: 400,
        data: {
          msg: 'Item not found!'
        }
      })
    }
    const price = item.price
    const name = item.title

    if (cart) {
      let itemIndex = cart.items.findIndex((p) => p.productId === productId)

      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex]
        productItem.quantity += quantity
        cart.items[itemIndex] = productItem
      }
      else {
        cart.items.push({
          productId,
          name,
          quantity,
          price
        })
      }
      cart.bill = calculateTotalCartBill(cart.items)
      cart = await cart.save()
      return responseObject(res, {
        status: 200,
        data: { cart }
      })
    }
    else {
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, quantity, price }],
        bill: price * quantity
      })
      return responseObject(res, {
        status: 201,
        data: { cart: newCart }
      })
    }
  } catch (error) {
    console.log(error)
    responseObject(res, {
      status: 500,
      data: {
        msg: 'Something went wrong'
      }
    })
  }
}

const update_cart_item = async (req, res) => {
  const userId = req.params.userId
  const { productId, quantity } = req.body
  try {
    const cart = await Cart.findOne({ userId })
    const itemIndex = cart.items.findIndex((p => p.productId === productId))
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity
      cart.bill = calculateTotalCartBill(cart.items)
    }
    cart = await cart.save()
    return responseObject(res, {
      status: 201,
      data: { cart }
    })
  } catch (error) {
    console.log(error)
    responseObject(res, {
      status: 500,
      data: {
        msg: 'Something went wrong'
      }
    })
  }
}

const delete_item = async (req, res) => {
  const { userId, itemId: productId } = req.params
  try {
    let cart = await Cart.findOne({ userId })
    let itemIndex = cart.items?.findIndex((p) => p.productId === productId)
    console.log(itemIndex)
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1)
      cart.bill = calculateTotalCartBill(cart.items)
      cart = await cart.save()
      return responseObject(res, {
        status: 201,
        data: { cart }
      })
    } else {
      responseObject(res, {
      status: 400,
      data: {
        msg: "Item doesn't exist"
      }
    })
    }
  } catch (error) {
    console.log(error)
    responseObject(res, {
      status: 500,
      data: {
        msg: 'Something went wrong'
      }
    })
  }
}

export default {
  get_cart_items,
  add_cart_item,
  update_cart_item,
  delete_item,
}