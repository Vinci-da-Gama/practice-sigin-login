var User = require('../../mongooseSchema/user.js');
var express = require('express');
var routerGetAllUsers = express.Router();

routerGetAllUsers.get('/allusers', function (req, res) {
	User.find({}, function (err, responseAllUsers) {
		if (err) {
			res.send(err);
			return;
		} else {
			res.json(responseAllUsers);
		}
	});
});

module.exports = routerGetAllUsers;