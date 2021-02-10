const mongoose = require('mongoose')
const hasher = require('../config/hasher')

const Schema = mongoose.Schema

const UserSchema = new Schema({
	discription: String,
	firstName: {
		type: String,
		required: 'The user profile requires a first name.'
	},
	lastName: {
		type: String,
		required: 'The user profile requires a last name.'
	},
	username: {
		type: String,
		required: 'The user profile requires a username.',
		unique: true
	},
	hash: {
		type: String,
		required: 'The user profile requires a password hash.'
	},
	email: {
		type: String,
		required: 'The user profile requires an email address.',
		match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
		unique: true
	},
	self: {
		type: Schema.Types.ObjectId,
		ref: 'Person'
	},
	family: {
		type: [Schema.Types.ObjectId],
		ref: 'Person'
	},
	level: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	lastLoggedIn: Date,
	loginName: String
});

/**
 * Verify the password for this user.
 * @param {String} password
 * @returns {Boolean} true if the password is correct.
 */
UserSchema.methods.verifyPassword = function(password) {
	return hasher.verify(password, this.hash)
}

/**
 * Used to setup the values when createing a new record.
 * @param {String} password 
 * @returns {User} the same user object.
 */
UserSchema.methods.setup = function(password) {
	this.discription = `User profile for ${this.firstName} ${this.lastName}.`
	this.hash = hasher.hash(password)
	this.email = this.email.toLowerCase()
	this.loginName = this.username.toLowerCase()
	return this
}

/**
 * Logs in the user.
 * @param {String} password
 * @returns {Boolean} true if the user was able to log in. 
 */
UserSchema.methods.login = function(password) {
	if (this.verifyPassword(password)) {
		this.lastLoggedIn = Date.now()
		return true
	}
	return false
}

/**
 * Used to change the user's password. First the user must provide the old password before changing it.
 * @param {String} oldPassword
 * @param {String} newPassword 
 * @returns {Boolean} true if the password was able to be changed.
 */
UserSchema.methods.changePassword = function(oldPassword, newPassword) {
	if (this.verifyPassword(oldPassword)) {
		this.hash = hasher.hash(newPassword)
		return true
	}
	return false
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
