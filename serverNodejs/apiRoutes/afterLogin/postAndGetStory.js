var msg = require('../../msg/msga.js');
var User = require('../../mongooseSchema/user.js');
var Story = require('../../mongooseSchema/story');
var express = require('express');

var routerPostAndGetStory = express.Router();

routerPostAndGetStory.route('/')
.post(function (req, res) {
	var inputedStoryObj = {
		creator: req.decoded._id,
		content: req.body.content
	};
	var curScenario = new Story(inputedStoryObj);

	curScenario.save(function (err) {
		var saveStoryMsg = msg.saveStoryMsgObj;
		vibeStoryActions(res, err, saveStoryMsg);
	});

})
.get(function (req, res) {
	var scenarioCreatorIdObj = {
		creator: req.decoded._id
	};
	Story.find(scenarioCreatorIdObj, function (err, responsiveStories) {
		vibeStoryActions(res, err, responsiveStories);
	});
});


function vibeStoryActions(response, errMsg, sensibleObj) {
	if (errMsg) {
		response.send(errMsg);
	} else {
		response.json(sensibleObj);
	}
};

module.exports = routerPostAndGetStory;