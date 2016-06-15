'use strict';

function AppCtrl($scope, $rootScope, $state, $ionicModal, $ionicSlideBoxDelegate, $cordovaKeyboard, $cordovaDialogs, $ionicSideMenuDelegate, $ionicHistory, $localStorage, Auth, User, Player, currentAuth, lodash) {
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
	$rootScope.user = currentAuth;
	vm.auth.$onAuth(function(authData) {
		if (authData && lodash.isUndefined($rootScope.user)) {
			var id = (authData.provider !== 'password') ? authData[authData.provider].id : authData.uid;
			User.get(id).$loaded().then(function(user) {
				$rootScope.user = user;
				userRoomConfig();
			});
		}
	});
	function userRoomConfig() {
		if ($rootScope.user && $rootScope.user.connected) {
			Player.ref().child('connected/' + $rootScope.user.id).set({
				name: $rootScope.user.displayName,
				image: $rootScope.user.profileImageURL
			});
			Player.ref().child('connected/' + $rootScope.user.id).onDisconnect().remove();
		}
	}
	userRoomConfig();

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
				delete $rootScope.user;
				delete $rootScope.queueList;

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