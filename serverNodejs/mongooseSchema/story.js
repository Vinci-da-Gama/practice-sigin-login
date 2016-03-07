var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// ref: 'User' -> connect to User Schema.
var storyContent = {
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	content: String,
	created: { type: Date, default: Date.now }
};

var storySchema = new Schema(storyContent);

module.exports = mongoose.model('Story', storySchema);