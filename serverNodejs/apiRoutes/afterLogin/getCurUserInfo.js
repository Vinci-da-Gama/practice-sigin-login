var User = require('../../mongooseSchema/user');
var msg = require('../../msg/msga.js');
var express = require('express');
var mongoose = require('mongoose');

var routerGetCurUserInfo = express.Router();

routerGetCurUserInfo.get('/curuser', function (req, res) {
	console.log('routerGetCurUserInfo -- line 8 req.decoded is: ', req.decoded);
	res.json(req.decoded);
});

module.exports = routerGetCurUserInfo;