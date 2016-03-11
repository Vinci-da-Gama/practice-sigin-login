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