const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
	discription: String,
	names: {
		appointed: {
			type: Number,
			default: 0
		},
		list: [{
			prefex: {
				value: String
			},
			given: {
				value: String,
				common: String,
				pronunciation: String,
				romanization: String
			},
			middle: {
				value: String,
				common: String,
				pronunciation: String,
				romanization: String
			},
			family: {
				value: String,
				pronunciation: String,
				romanization: String
			},
			suffex: {
				value: String
			},
			category: {
				type: String,
				enum: ['birth', 'adoption', 'marrage', 'change'],
				default: 'birth'
			},
			language: {
				type: String,
				default: 'en'
			}
		}]
	},
	gender: String,
	story: String,
	relationships: {
		parents: [{
			id: {
				type: Schema.Types.ObjectId,
				ref: "Person"
			},
			title: String,
			method: String
		}],
		spouses: [{
			id: {
				type: Schema.Types.ObjectId,
				ref: "Person"
			},
			title: String,
			status: String
		}],
		children: [{
			id: {
				type: Schema.Types.ObjectId,
				ref: "Person"
			},
			title: String,
			method: String
		}]
	},
	events: [{
		category: String,
		discription: String,
		id: {
			type: Schema.Types.ObjectId,
			ref: "Event"
		}
	}],
	treeId: {
		type: Schema.Types.ObjectId,
		ref: "Tree"
    },
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User"
    },
	created: {
		byId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		date: {
			type: Date,
			default: Date.now
		}
	},
});

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person;
