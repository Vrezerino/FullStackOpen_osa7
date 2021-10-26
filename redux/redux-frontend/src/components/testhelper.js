/* eslint-disable no-undef */
const blogs = [
	{
		author: 'Author 1',
		title: 'Test Title 1',
		url: 'https://test1',
		likes: 50,
		comments: [
			'test comment on blog 1'
		]
	},
	{
		author: 'Author 2',
		title: 'Test Title 2',
		url: 'https://test2',
		likes: 3,
		comments: [
			'test comment on blog 2'
		]
	}
]

const user = {
	name: 'tester',
	username: 'testname',
	id: 'test3939'
}

const token = 'bearer testtoken'

module.exports = {
	blogs,
	user,
	token
}