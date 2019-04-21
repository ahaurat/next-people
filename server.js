const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const next = require('next')
const keys = require('./config/keys')
require('./models/Person')

let port = parseInt(process.env.PORT, 10) || 3000
// Use port 3001 for running tests
if (process.env.NODE_ENV === 'test') port++
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// Connect to DB
// mongoose.connect('mongodb://mongo:27017/express-mongo', {useNewUrlParser: true})
mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// Log unhandled promise rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

let server

module.exports = nextApp.prepare().then(() => {
  server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({extended: true}))

  require('./api/personRoutes')(server)

  server.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})