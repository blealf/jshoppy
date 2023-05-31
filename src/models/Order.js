import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  userId: {
    type: String
  },
  items: [{
    productId: {
      type: String
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less then 1.']
    },
    price: Number
  }],
  bill: {
    type: Number,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('order', OrderSchema)