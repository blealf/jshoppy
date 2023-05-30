import Item from '../models/Item.js'
import { responseObject } from '../utils/helpers.js'

const get_items = async (_, res) => {
  const items = await Item.find().sort({ date: -1 })
  responseObject(res, { status: 200, data: items })
}

const post_item = async (req, res) => {
  const newItem = new Item(req.body)
  const savedItem = await newItem.save()
  responseObject(res, { status: 200, data: savedItem })
}

export default {
  get_items,
  post_item
}