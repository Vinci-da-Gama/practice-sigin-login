var User = require('../../mongooseSchema/user');
var msg = require('../../msg/msgb.js');
var express = require('express');
var routerSignUp = express.Router();

routerSignUp.post('/signup', function(req, res) {
	var userInfoObj = {
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	};
	var userWillSignIn = new User(userInfoObj);
	userWillSignIn.save(function (err) {
		if (err) {
			res.send(err);
			console.log('15 -- err', err);
			return;
		} else {
			var signUpMsg = {
				message: msg.signupSuccessMsg
			}
			res.json(signUpMsg);
		}
	});
});

module.exports = routerSignUp;