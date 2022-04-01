require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const cors = require('cors')
const helmet = require('helmet')
const config = require('./utils/config')
const routes = require('./api/routes')
const auth = require('./api/auth')

app.use(express.json())
app.use(cors(config.cors))
app.use(helmet())
app.use('/', routes)
app.use(auth.key)
app.listen(port)