const bcrypt = require('bcrypt')
const registrationRouter = require('express').Router()
const User = require('../models/user')

registrationRouter.post('/', async (req, res) => {
	const body = req.body

	if (body.password.length < 8) {
		return res.status(400).json({ error: 'User validation failed: password: Password must be longer than 8 characters.' })
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)
	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash
	})
	const savedUser = await user.save()
	res.json(savedUser)
})

module.exports = registrationRouter