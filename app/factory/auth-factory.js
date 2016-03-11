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

			return loginResult;

		};

		authenticatedFactory.logout = function () {
			AuthToken.setToken();
		};

		authenticatedFactory.isLoggedInMiddleWareFrontEnd = function () {
			var hasToken = AuthToken.getToken();
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
				};
				return $q.reject(noTokenMsg);
			}
		};

		return authenticatedFactory;

	}]);

	authM.factory('AuthToken', ['$window', function($window){
		var authHandleTokenFactory = {};
		var tk = 'token';

		authHandleTokenFactory.getToken = function () {
			var theToken = $window.localStorage.getItem(tk);
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

		interceptorFactory.request = function (config) {
			var token = AuthToken.getToken();
			if (token) {
				config.headers['x-access-token'] = token;
			} else {
				return config;
			}
		};

		interceptorFactory.responseError = function (response) {
			if (response.status === 403) {
				console.log('auth interceptorFactory line 97 -- status: '+response.status);
				$state.go('home');
			} else if(response.status === 401) {
				console.log('line 100 AuthInterceptor Unauthorized User.');
				$state.reload();
			} else {
				console.log('reject response.');
				return $q.reject(response);
			}
		};

		return interceptorFactory;

	}]);

})();