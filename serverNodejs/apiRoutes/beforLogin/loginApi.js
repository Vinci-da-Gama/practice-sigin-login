var User = require('../../mongooseSchema/user');
var express = require('express');
var config = require('../../config');
var msg = require('../../msg/msgb.js');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;
var routerLogin = express.Router();

routerLogin.post('/login', function (req, res) {
	var userName = {
		username: req.body.username
	};
	User.findOne(userName).select('password').exec(function (err, thisUser) {
		// if has error.
		if (err) {
			throw err;
		} else {
			// if this user doesnot exist.
			if (!thisUser) {
				var noThisUser = {
					message: msg.noUserMsg
				};
				res.send(noThisUser);
			} else if (thisUser) {
				var inputPassword = req.body.password;
				var validPasswordBool = thisUser.comparePassword(inputPassword);
				// match password
				if (!validPasswordBool) {
					var invalidPwMsg = {
						message: msg.invalidPasswordMsg
					};
					res.send(invalidPwMsg);
				} else {
					var token = creatToken(thisUser);
					var loginSuccessObj = {
						success: true,
						message: msg.loginSuccessMsg,
						token: token
					};
					res.json(loginSuccessObj);
				}
			} else {
				var unknownMsg = {
					message: msg.unknownLoginMsg
				};
				res.send(unknownMsg);
			}
		}

	});
});

function creatToken(localUser) {
	var signObj = {
		_id: localUser._id,
		name: localUser.name,
		username: localUser.username
	};
	var jsonTokenExpireObj = {
		expirtesInMinute: 1440
	};
	var token = jsonwebtoken.sign(signObj, secretKey, jsonTokenExpireObj);

	return token;
};

module.exports = routerLogin;