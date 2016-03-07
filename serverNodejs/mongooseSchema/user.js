var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var userContent = {
	name: String,
	username: {type: String, required: true, index: {unique: true}},
	password: {
		type: String,
		required: true,
		select: false
	}
};
var userSchema = Schema(userContent);

// pre is a kind of middleware -- checked here: http://mongoosejs.com/docs/middleware.html
// hash password
userSchema.pre('save', function (next) {
	// this is userSchema
	// var randomNum1 = Math.floor((Math.random() * 300) + 1);
	var theUser = this;
	console.log('22 -- next is: ', next);

	if (!theUser.isModified('password')) return next();

	bcrypt.hash(theUser.password, null, null, function (err, hashPassword) {
		if (err) return next(err);

		theUser.password = hashPassword;
		next();
	});

});

// whether password matched function
userSchema.methods.comparePassword = function (currPassword) {
	var theUser = this;
	// var passwordMatchedBool = bcrypt.compareSync(currPassword, theUser.password);
	return bcrypt.compareSync(currPassword, theUser.password);
};

module.exports = mongoose.model('User', userSchema);