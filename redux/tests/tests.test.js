/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const helper = require('../utils/helper')
const initialBlogs = helper.initialBlogs
const testBlog = helper.testBlog
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

test('dummy returns one', () => {
	const result = helper.dummy([])
	expect(result).toBe(1)
})

const login = async () => {
	const loggedinUser = await api.post('/api/login').send({ username: 'tester', password: 'testpassword' })
	return loggedinUser
}

describe('after initially inserting a few blogs', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(initialBlogs)
	})

	test('collection has the expected amount of blogs', async () => {
		const blogs = await helper.notesFromDB()
		expect(blogs).toHaveLength(6)
	})

	test('one can register an account', async () => {
		await User.deleteMany({})
		await api.post('/api/register')
			.send({ username: 'tester', name: 'testname', password: 'testpassword' })
			.expect(200)
	})

	test('one can log in', async () => {
		await login()
	})

	test('one can POST blogs', async () => {
		const loggedInUser = await login()
		const token = loggedInUser.body.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		expect(token).not.toBe(null)
		expect(decodedToken.id).not.toBe(null)

		const user = await User.findById(decodedToken.id)
		let savedBlogID

		await api
			.post('/api/blogs')
			.set('Authorization', 'bearer ' + token)
			.send(testBlog)
			.expect(201)
			.expect('Content-Type', /json/)
			.then((res) => {
				expect(res.body.id).not.toBe(null)
				savedBlogID = res.body.id
			})

		user.blogs = user.blogs.concat(savedBlogID)
		await User.updateOne( { id: user.id }, { $push: { blogs: savedBlogID } } )

		const blogs = await helper.notesFromDB()
		expect(blogs).toHaveLength(7)

		const users = await User.find({})
		expect(users[0].blogs).toContainEqual(mongoose.Types.ObjectId(savedBlogID))
	})

	test('likes is 0 when likes property is missing from request body', async () => {
		const blog = await new Blog(testBlog).save()
		expect(blog.likes).toEqual(0)
	})

	test('blog ObjectID is an id as opposed to _id', async () => {
		const blog = await new Blog(testBlog).save()
		expect(blog.id).toBeDefined()
	})

	test('expect status code 400 when title or url missing from request body', async () => {
		const { url, ...testBlogWithoutURL } = testBlog // jättää url-kentän pois
		const loggedInUser = await login()
		const token = loggedInUser.body.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		expect(token).not.toBe(null)
		expect(decodedToken.id).not.toBe(null)

		await api
			.post('/api/blogs')
			.set('Authorization', 'bearer ' + token)
			.send(testBlogWithoutURL)
			.expect(400)
	})

	test('a blog can be deleted', async () => {
		const deleteMe = '5a422a851b54a676234d17f7'

		const loggedInUser = await login()
		const token = loggedInUser.body.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		expect(token).not.toBe(null)
		expect(decodedToken.id).not.toBe(null)

		await api
			.delete(`/api/blogs/${deleteMe}`)
			.set('Authorization', 'bearer ' + token)
			.expect(200)

		const blogs = await helper.notesFromDB()
		expect(blogs).toHaveLength(5)
	})

	describe('total likes', () => {
		test('of empty list is zero', () => {
			const result = helper.totalLikes([])
			expect(result).toBe(0)
		})
		test('when list has one blog, equals likes of that', async () => {
			const oneBlogArray = []
			const blog = await Blog.findById('5a422a851b54a676234d17f7')
			oneBlogArray.push(blog)

			const result = helper.totalLikes(oneBlogArray)
			expect(result).toBe(67)
		})
		test('of a bigger list is calculated right', async () => {
			const blogs = await helper.notesFromDB()
			const result = helper.totalLikes(blogs)
			expect(result).toBe(97)
		})
	})

	describe('blog with most likes', () => {
		test('in a list is the correct one', async () => {
			const blogs = await helper.notesFromDB()
			const result = helper.favoriteBlog(blogs)
			expect(result).toEqual(blogs[0])
		})
	})

	describe('author', () => {
		test('with most blogs is the expected one', async () => {
			const blogs = await helper.notesFromDB()
			const result = helper.mostBlogs(blogs)
			expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
		})
		test('with most likes is the expected one', async () => {
			const blogs = await helper.notesFromDB()
			const result = await helper.mostLikes(blogs)
			expect(result).toEqual({ author: 'Michael Chan', likes: 67 })
		})
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})

module.exports = api