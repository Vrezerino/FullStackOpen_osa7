const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
	res.json(users.map(u => u.toJSON()))
})

userRouter.get('/id/:id', async (req, res) => {
	const user = await User.findById(req.params.id.toString())
	res.json(user)
})

module.exports = userRouter