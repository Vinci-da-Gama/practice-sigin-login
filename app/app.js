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