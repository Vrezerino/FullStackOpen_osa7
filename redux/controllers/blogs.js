/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

blogsRouter.get('/', async (req, res) => {
	const allBlogs = await Blog.find({})
	res.json(allBlogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id)
	if (blog) {
		res.json(blog)
	} else {
		res.status(404).send('404')
	}
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body
	console.log(body.title)
	const decodedToken = jwt.verify(req.token, process.env.SECRET)
	if (!req.token || !decodedToken.id) {
		return res.status(401).json({ error: 'Token missing or invalid!' })
	}
	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		user: user._id,
		name: user.name
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	res.status(201).json(savedBlog.toJSON())
})

blogsRouter.post('/:id/comments', async (req, res) => {
	const body = req.body
	if (body.comment.comment.length < 1 || body.comment.comment.length > 200) {
		return res.status(400).json({ error: 'Comment validation failed: comment: Comment minlength = 1, maxlength = 200.' })
	}
	const decodedToken = jwt.verify(req.token, process.env.SECRET)
	if (!req.token || !decodedToken.id) {
		return res.status(401).json({ error: 'Token missing or invalid!' })
	}

	const commentDate = new Date().toUTCString()
	const comment = `${body.name} on ${commentDate} : ${body.comment.comment}`
	await Blog.findByIdAndUpdate(
		mongoose.Types.ObjectId(req.params.id),
		{ $push: { comments: comment } }
	)
	res.status(201).json(comment)
})

blogsRouter.put('/:id', async (req, res) => {
	const updatedBlog = await Blog.findByIdAndUpdate(
		req.params.id, req.body,
		{ new: true, runValidators: true, context: 'query' })
	res.json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET)
	if (!req.token || !decodedToken.id) {
		return res.status(401).json({ error: 'Token missing or invalid!' })
	}
	await Blog.deleteOne({ '_id': req.params.id })
	await User.updateOne({ id: decodedToken.id }, { $pull: { blogs: { id: req.params.id.toString() } } })
	res.status(200).end()
})

module.exports = blogsRouter