const mongoose = require('mongoose')
const badwords = require('../utils/badwords')

const isNotEmpty = string => string !== ''
const containsNoBadwords = string => !badwords.array.some(badword => string.toLowerCase().includes(badword))

const validate = [
	{ validator: isNotEmpty, msg: 'No content.' },
	{ validator: containsNoBadwords, msg: 'Watch your language.' }
]

const blogSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		validate
	},
	author: {
		type: String,
		required: true,
		validate
	},
	url: {
		type: String,
		required: true,
		validate
	},
	likes: {
		type: Number,
		required: true,
		default: 0
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		validate
	},
	comments: [String]
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject._v
	}
})

module.exports = mongoose.model('Blog', blogSchema)