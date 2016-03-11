(function () {
	var authM = angular.module('storyApp.auth.factory');

	authM.factory('Auth', ['$http', '$q', 'AuthToken', function($http, $q, AuthToken){
		var authenticatedFactory = {};

		authenticatedFactory.login = function (uname, pswd) {
			var loginUserObj = {
				username: uname,
				password: pswd
			};
			var loginResult = $http.post('/api/login', loginUserObj)
				.success(function (data) {
					console.log('authenticatedFactory line 14 loginResult: ', data);
					var loggedInToken = data.token;
					AuthToken.setToken(loggedInToken);
					return data;
				})
				.error(function(data, config, status) {
					console.log('auth factory -- error data: ', data);
					var failLoginMsg = {
						message: "Canot login due to STATUS: "+status+" - Config: "+config
					};
					return failLoginMsg;
				});
		};

		authenticatedFactory.logout = function () {
			AuthToken.setToken();
		};

		authenticatedFactory.isLoggedInMiddleWareFrontEnd = function () {
			var hasToken = AuthToken.getToken();
			console.log('auth factory line 33 -- hasToken: '+hasToken);
			if (hasToken) {
				return true;
			} else {
				return false;
			}
		};

		authenticatedFactory.getLoggedInUserInfo = function () {
			var hasToken = AuthToken.getToken();
			if (hasToken) {
				var receivedUserInfo = $http.get('/api/curuser');
				return receivedUserInfo;
			} else {
				var noTokenMsg = {
					message: "This User has no Token."
				}
				return noTokenMsg;
			}
		};

		return authenticatedFactory;

	}]);

	authM.factory('AuthToken', ['$window', function($window){
		var authHandleTokenFactory = {};
		var tk = 'token';

		authHandleTokenFactory.getToken = function () {
			var theToken = $window.localStorage.getItem(tk);
			console.log('AuthToken factory line 64 theToken is: ', theToken);
			return theToken;
		}

		authHandleTokenFactory.setToken = function (passedInToken) {
			if (passedInToken) {
				$window.localStorage.setItem(tk, passedInToken);
			} else {
				$window.localStorage.removeItem(tk);
			}
		};

		return authHandleTokenFactory;
	}]);

	authM.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function($q, $location, AuthToken){
		var interceptorFactory = {};
		var token = AuthToken.getToken();

		interceptorFactory.request = function (config) {
			if (token) {
				config.headers['x-access-token'] = token;
			} else {
				return config;
			}
		};

		interceptorFactory.responseError = function (response) {
			if (response.status === 403) {
				console.log('auth interceptorFactory line 93 -- status: '+response.status);
				$location.path('/login');
			} else {
				console.log('auth interceptorFactory line 96 -- status: '+response.status);
				return $q.reject(response);
			}
		};

		return interceptorFactory;

	}]);

})();