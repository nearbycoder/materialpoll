var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PollSchema   = new Schema({
	id: String,
	name: String,
	answers: Schema.Types.Mixed,
	votes: Schema.Types.Mixed,
	multiple: Boolean,
	singleIP: Boolean,
	IpAddresses: Schema.Types.Mixed,
});

module.exports = mongoose.model('Poll', PollSchema);