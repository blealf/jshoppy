import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'
import router from './routes/index.js'

const app = express()
const PORT = 3002

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// middleware
app.use(express.json())
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

const mongo = async () => {
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

mongo()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

