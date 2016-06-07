'use strict';

function AppCtrl($scope, $rootScope, $state, $ionicModal, $ionicSlideBoxDelegate, $cordovaKeyboard, $cordovaDialogs, $ionicSideMenuDelegate, $ionicHistory, $localStorage, Auth, User, Queue, currentAuth, lodash) {
	var vm = this;
	$ionicModal.fromTemplateUrl('templates/modal/login.tmpl.html', {
		scope: $scope,
		controller: 'LoginCtrl',
		animation: 'slide-in-up'
	}).then(function(modal) {
		vm.modal = modal;
		vm.login = {};
	});
	vm.auth = Auth;
	vm.user = currentAuth;
	vm.auth.$onAuth(function(authData) {
		if (authData && lodash.isUndefined(vm.user)) {
			if (authData.provider === 'password') {
				User.get(authData.uid).$loaded().then(function(user) {
					vm.user = user;
					$rootScope.user = vm.user;
				});
			}else {
				vm.user = authData[authData.provider];
				$rootScope.user = vm.user;
			}
		}
	});

	$rootScope.openLogin = function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			$cordovaKeyboard.disableScroll(true);
		}
		vm.modal.show();
		vm.login.title = 'Login';
		$ionicSlideBoxDelegate.enableSlide(false);
	};

	vm.signupPage = function() {
		vm.login.title = 'Signup';
		$ionicSlideBoxDelegate.slide(0);
	};

	vm.loginPage = function() {
		vm.login.title = 'Login';
		$ionicSlideBoxDelegate.slide(1);
	};

	$rootScope.closeLogin = function() {
		vm.modal.hide().then(function() {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				$cordovaKeyboard.disableScroll(false);
			}
		});
	};

	vm.logout = function() {
		$cordovaDialogs.confirm('Are you sure you want to logout?', 'Alma').then(function(res) {
			if (res === 1) {
				if ($ionicSideMenuDelegate.isOpenLeft() === true) {
					$ionicSideMenuDelegate.toggleLeft();
				}
				$localStorage.$reset();
				Auth.$unauth();
				delete vm.user;

				var current = $ionicHistory.currentView();
				if (current.stateName === 'app.settings' || current.stateName === 'app.profile') {
					$state.transitionTo('app.dashboard');
				}
				$ionicHistory.nextViewOptions({
					historyRoot: true
				});
				$cordovaDialogs.alert('You have been successfully logged out', 'Alma');
			}
		});
	};

	function onResume() {

	}

	function onPause() {

	}
	document.addEventListener('resume', onResume, false);
	document.addEventListener('pause', onPause, false);
}
angular.module('arcanine.controllers', []).controller('AppCtrl', AppCtrl);