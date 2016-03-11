(function () {
	var ctrlM = angular.module('storyApp.ctrl');

	ctrlM.controller('navbarCtrl', ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth){
		console.log('navbarCtrl');
		var vm = this;
	}]);

})();