(function () {

	var anguNg = ['ngAria', 'ngSanitize', 'ngAnimate', 'ngMessages', 'ngNotify'];
	var anguEx = ['ui.bootstrap', 'mgcrea.ngStrap', 'angularMoment', 'bootstrapLightbox'];
	var routerCtrl = ['storyApp.router', 'storyApp.ctrl'];
	var cons = ['storyApp.constant'];
	var serv = ['storyApp.sig.service', 'storyApp.service'];
	var facy = ['storyApp.auth.factory', 'storyApp.func.factory', 'storyApp.signUp.factory'];
	var dir = ['storyApp.dir', 'storyApp.cust.dir'];

	var depedencyArr = anguNg.concat(anguEx, routerCtrl, cons, serv, facy, dir);
	/**
	* storyApp Module
	*
	* The main module of this application...
	*/
	angular.module('storyApp', depedencyArr);

	angular.module('storyApp.router', ['ui.router']);
	angular.module('storyApp.constant', []);
	angular.module('storyApp.sig.service', []);
	angular.module('storyApp.service', []);
	angular.module('storyApp.auth.factory', []);
	angular.module('storyApp.func.factory', []);
	angular.module('storyApp.signUp.factory', []);
	angular.module('storyApp.ctrl', ['storyApp.auth.factory', 'storyApp.signUp.factory']);
	angular.module('storyApp.dir', ['storyApp.service', 'storyApp.sig.service']);
	angular.module('storyApp.cust.dir', ['storyApp.service', 'storyApp.sig.service']);

})();
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
(function () {
	var cosM = angular.module('storyApp.constant');

})();
(function () {
	var ctrlM = angular.module('storyApp.ctrl');

	ctrlM.controller('navbarCtrl', ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth){
		console.log('navbarCtrl');
		var vm = this;
		vm.didLoggedIn = Auth.isLoggedInMiddleWareFrontEnd();

		$rootScope.$on('$stateChangeStart', function () {
			vm.didLoggedIn = Auth.isLoggedInMiddleWareFrontEnd();
			Auth.getLoggedInUserInfo()
			.then(function (data) {
				console.log('13 -- navbarCtrl getLoggedInUserInfo is: ', data);
				vm.user = data.data;
			});

		});

		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
			console.log('32 $stateChangeSuccess event: ', event);
			console.log('33 $stateChangeSuccess toState: ', toState);
			console.log('34 $stateChangeSuccess toParams: ', toParams);
			console.log('35 $stateChangeSuccess fromState: ', fromState);
			console.log('36 $stateChangeSuccess fromParams: ', fromParams);
			console.log('37 $stateChangeSuccess error: ', error);
		});

		vm.navLogout = function () {
			Auth.logout();
			// $state.go('home');
			$state.reload();
			console.log('31 -- Did Logout.');
		};

	}]);

	ctrlM.controller('loginCtrl', ['$state', 'Auth', function($state, Auth){
		var vm = this;

		vm.doLogin = function () {
			vm.error = '';
			vm.processing = true;

			Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function (loginResponse) {
				vm.processing = false;
				Auth.getLoggedInUserInfo()
				.then(function (data) {
					console.log('48 -- loginCtrl getLoggedInUserInfo data :', data);
					vm.user = data.data;
				});

				if (loginResponse.success) {
					$state.go('home');
				} else {
					vm.error = loginResponse.message;
				}

			});

		};

	}]);

})();
(function () {
	var cdM = angular.module('storyApp.cust.dir');

	// cdM

})();
(function () {
	var dM = angular.module('storyApp.dir');

	// dM

})();
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
(function () {
	var funcM = angular.module('storyApp.func.factory');

	// funcM

})();
(function () {
	var signupM = angular.module('storyApp.signUp.factory');

	// signupM

})();
// service js Document
// $log.log("sigSrevice error line -- 15 --- data : "+data+" config: "+config+" status: "+status+".---");
	/*sM.service('verifyNumStrObjArrUndefinedElem', ['$log', function($log){
		
		this.IsNumberAndGreaterThanZero = function (figure) {
			var numBool = angular.isNumber(figure) && !isNaN(figure) && figure > 0;
			return numBool;
		};

		this.IsNumberAndGreaterThanWhileEqualZero = function (figure) {
			var numBool = angular.isNumber(figure) && !isNaN(figure) && figure >= 0;
			return numBool;
		};

		this.IsStringAndNotNull = function (str) {
			var strBool = angular.isString(str) && str.length > 0 && str !== null && str !== '';
			return strBool;
		};

		this.IsUndefined = function (testimony) {
			var refBool = angular.isUndefined(testimony);
			return refBool;
		};

		this.IsJqOrDomElem = function (jqdomElem) {
			var argBool = angular.isElement(jqdomElem) && typeof(jqdomElem) !== 'undefined';
			return argBool;
		};

		this.IsObjAndNotEmpty = function (obj) {
			var objBool = angular.isObject(obj) && Object.keys(obj).length > 0 && typeof(obj) !== 'undefined';
			return objBool;
		};

		this.IsArrayAndNotUnfilled = function (arr) {
			var arrBool = angular.isArray(arr) && arr.length > 0 && typeof(arr) !== 'undefined';
			return arrBool;
		}

	}]);*/
(function () {
	var sM = angular.module('storyApp.service');

	// sM

})();
// service js Document
// $log.log("sigSrevice error line -- 14 --- data : "+data+" config: "+config+" status: "+status+".---");
/*sigM.service('inquireInfo', ['$http', '$log', 'appnameDb', function($http, $log, appnameDb){
	var dbPath = appnameDb.dbDot+appnameDb.delimiter+appnameDb.dbPrefix+appnameDb.delimiter+appnameDb.dbName+appnameDb.dbExtension;

	this.obtainDossier = function (func) {
		$http.get(dbPath)
		.then(function (testimony) {
			func(testimony.data);
			$log.log('get data successfully. '+dbPath);
		})
		.catch(function (data, config, status) {
			$log.log("sigSrevice error line -- 16 -\&\#1046\;- data : "+data+" config: "+config+" status: "+status+".---");
		})
		.finally(function () {
			$log.log('sigSrevice line 19, finally method.');
		});
	};

}]);*/
(function () {
	var ssM = angular.module('storyApp.sig.service');

	// ssM

})();
// jQuery Js Document
$(document).ready(function() {
	// notice ();
	initWow ();
});

function notice () {
	alert('pls, disable this function.'+window.location);
}

function initWow () {
	new WOW().init();
}