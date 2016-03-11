(function () {
	var rM = angular.module('storyApp.router');

	rM.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: './_partials/home.html',
			controller: 'navbarCtrl'
		})
		.state('loginPage', {
			url: '/login',
			templateUrl: './_partials/login.html',
			controller: 'loginCtrl'
		});

	}]);

})();