import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'
import router from './src/routes/index.js'
import authMiddleware from './src/middleware/auth.js'

const app = express()
const PORT = process.env.NODE_ENV === 'test' ? 4000 : 3002

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// middleware
app.use(express.json())
// app.use(authMiddleware)
router(app)

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'))
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
//   })
// }

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
  // res.send('Something')
})

const server = () => {
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

const startMongo = async () => {
  mongoose.set("strictQuery", false);
  const dbURI = config.get('dbURI')
  try {
    await mongoose.connect(dbURI)
      .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err))
  } catch(err) {
    console.log(err)
  }
}

startMongo()

export default server()