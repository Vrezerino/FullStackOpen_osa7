const logger = require('./logger')

/*
const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}
*/

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7)
	}
	next()
}

const unknownEndpoint = (request, response, next) => {
	response.status(404).send({ error: 'Unknown endpoint!' })
	next()
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'Malformatted ID!' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'Invalid token!' })
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({ error: 'Token expired!' })
	}
	next(error)
}

module.exports = {
	tokenExtractor,
	unknownEndpoint,
	errorHandler,
}