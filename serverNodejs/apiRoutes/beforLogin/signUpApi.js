var User = require('../../mongooseSchema/user');
var msg = require('../../msg/msgb.js');
var signupConfig = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var express = require('express');

var obscureKey = signupConfig.secretKey;
var routerSignUp = express.Router();

routerSignUp.post('/signup', function(req, res) {
	var userInfoObj = {
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	};

	var userWillSignIn = new User(userInfoObj);
	var suToken = createTokenForSignup(userInfoObj);

	userWillSignIn.save(function (err) {
		if (err) {
			res.send(err);
			console.log('15 signupApi -- err', err);
			return;
		} else {
			var signupSuccessResponseObj = {
				success: true,
				message: msg.signupSuccessMsg,
				token: suToken
			};
			console.log('line 31 signupApi signupSuccessResponseObj is: ', signupSuccessResponseObj);

			res.json(signupSuccessResponseObj);
		}
	});
});

function createTokenForSignup(theSignUpUserObj) {
	var jsonwebtokenExpireObj = {
		expirtesInMinute: 1440
	};
	var signupToken = jsonwebtoken.sign(theSignUpUserObj, obscureKey, jsonwebtokenExpireObj);

	return signupToken;
};

module.exports = routerSignUp;