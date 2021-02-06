const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	discription: {
		type: String,
		required: 'The user profile requires a discription.'
	},
	first_name: {
		type: String,
		required: 'The user profile requires a first name.'
	},
	last_name: {
		type: String,
		required: 'The user profile requires a last name.'
	},
	username: {
		type: String,
		required: 'The user profile requires a username.'
	},
	password_hash: {
		type: String,
		required: 'The user profile requires a password hash.'
	},
	email: {
		type: String,
		required: 'The user profile requires an email address.'
	},
	family: {
		type: Schema.Types.ObjectId,
		ref: "Family"
	}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
