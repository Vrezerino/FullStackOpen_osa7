/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const dummy = (array) => 1
const totalLikes = (blogs) => blogs.reduce((a, b) => (a + b.likes), 0)
const favoriteBlog = (blogs) => blogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr)
const Blog = require('../models/blog')

const notesFromDB = async () => {
	const blogs = await Blog.find({})
	return blogs.map(b => b.toJSON())
}

const mostBlogs = (blogs) => {
	const authors = blogs.map(b => b.author)
	const authorsAndBlogCounts = []

	for (let i = 0, count = 0, j = 0; i < authors.length; i++) { // purkkaratkaisu
		if ((authors[j] !== authors[i])) {
			authorsAndBlogCounts.push({ author: authors[j], blogs: count })
			j = i
			count = 0
		}
		count++
		if (i === authors.length - 1) authorsAndBlogCounts.push({ author: authors[i], blogs: count })
	}
	return authorsAndBlogCounts.reduce((prev, curr) => prev.blogs > curr.blogs ? prev : curr)
}

const mostLikes = (blogs) => {
	const authorsAndBlogLikes = []

	for (let i = 0, likes = 0, j = 0; i < blogs.length; i++) { // purkkaratkaisu
		if ((blogs[j].author !== blogs[i].author)) {
			authorsAndBlogLikes.push({ author: blogs[j].author, likes: likes })
			j = i
			likes = 0
		}
		likes += blogs[i].likes
		if (i === blogs.length - 1) authorsAndBlogLikes.push({ author: blogs[i].author, likes: likes })
	}
	return authorsAndBlogLikes.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr)
}

const initialBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 67,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 3,
		__v: 0
	}
]

const testBlog = {
	title: 'test title',
	url: 'https://test.test',
	author: 'test author',
	name: 'test blog adder',
	likes: 0,
	user: null,
	comments: null
}

module.exports = {
	dummy,
	notesFromDB,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	testBlog,
	initialBlogs
}