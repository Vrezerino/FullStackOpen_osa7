const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: [3, 'Username must be longer than 4 characters.'],
		maxlength: [20, 'Username must be shorter than 20 characters.']
	},
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: [3, 'Name must be longer than 4 characters.'],
		maxlength: [30, 'Name must be shorter than 20 characters.']
	},
	passwordHash: {
		type: String,
		required: true
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)