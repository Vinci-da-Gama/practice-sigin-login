var jsonwebtoken = require('jsonwebtoken');
var express = require('express');
var User = require('../mongooseSchema/user.js');
var configLMW = require('../config');
var msg = require('../msg/msgb.js');

var obscureKey = configLMW.secretKey;
var routerLoginMidWare = express.Router();

routerLoginMidWare.use(function (req, res, next) {
	var curTokenBool = req.body.token || req.param('token') || req.headers['x-access-token'];
	console.log('Does it has token? '+curTokenBool);

	if (curTokenBool) {
		jsonwebtoken.verify(curTokenBool, obscureKey, function (err, decoded) {
			var noAuthMsg = {
				success: false,
				message: msg.authenticatedMsg
			};
			if (err) {
				res.status(403).send(noAuthMsg);
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		var noTokenMsg = {
			success: false,
			message: msg.loginNoToken
		};
		res.status(403).send(noTokenMsg);
	}

});

/*routerLoginMidWare.get('/', function (req, res) {
	var loggedInMsg = {
		message: msg.loginWelcomeMsg
	};
	res.json(loggedInMsg);
});*/

module.exports = routerLoginMidWare;