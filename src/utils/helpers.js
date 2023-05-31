export const responseObject = (response, {status, data, error}) => {
  response.status(status).json({
    data,
    error,
    status
  })
}

export const calculateTotalCartBill = (items) => {
  return items.reduce((acc, val) =>  acc + (val.price * val.quantity), 0)
}