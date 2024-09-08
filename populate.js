require('dotenv').config()

const connectdb= require('./database/connection')
// const user = require('./database/models/user')
const auction = require('./database/models/auction')
// const jsonusers = require('./users.json')

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URL)
    await auction.deleteMany()
    // await user.create(jsonusers)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
