const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
	title: String,
	body: String
});

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person;
