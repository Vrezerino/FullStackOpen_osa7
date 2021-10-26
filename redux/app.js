const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const registrationRouter = require('./controllers/register')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to', config.MONGODB_URI)
morgan.token('body', (req) => JSON.stringify(req.body))

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => {
		logger.info('Connected to MongoDB!')
	})
	.catch((error) => {
		logger.error('Error while connecting to MongoDB:', error.message)
	})

app.use(morgan(':method :url :status - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use('/api/blogs', middleware.tokenExtractor, blogsRouter)
app.use('/api/register', registrationRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app