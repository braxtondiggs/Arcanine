'use strict';

function DashboardCtrl($scope, $rootScope, $state, $timeout, $ionicActionSheet, $ionicScrollDelegate, $cordovaKeyboard, Chat, Player, Loading) {
	var vm = this;
	vm.loaded = false;
	if ($rootScope.user && $rootScope.user.connected) {
		Chat.get().$loaded().then(function(chats) {
			vm.loaded = true;
			vm.chats = chats;
		});
	}

	vm.tutorial = function() {
		$state.transitionTo('app.venue');
	};

	vm.submit = function() {
		if (vm.chatForm.$valid) {
			Player.auth().then(function() {
				Loading.show();
				vm.chats.$add({
					message: vm.chatForm.message.$viewValue,
					timestamp: Firebase.ServerValue.TIMESTAMP,
					user: {
						name: $rootScope.user.displayName,
						image: $rootScope.user.profileImageURL,
						id: $rootScope.user.id
					}
				}).then(function() {
					Loading.hide();
					$ionicScrollDelegate.scrollBottom(true);
					vm.message = '';
				});
			});
		}
	};
	vm.onHold = function(chat) {
		$ionicActionSheet.show({
			buttons: [{
				text: 'Delete Message'
			}],
			titleText: 'Message Options',
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				switch (index) {
					case 0:
						Player.auth().then(function() {
							Loading.show();
							vm.loaded = false;
							vm.chats.$remove(chat).then(function() {
								Loading.hide();
								vm.loaded = true;
							});
						});
						$timeout(function() {
							$ionicScrollDelegate.resize();
						}, 0);
						break;
				}
				return true;
			}
		});
	};
	vm.getKeys = function($event) {
		if ($event.which === 13) {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				if ($cordovaKeyboard.isVisible()) {
					$cordovaKeyboard.close();
				}
			}
			vm.submit();
		}
	};
	$scope.$on('$ionicView.enter', function() {
		$ionicScrollDelegate.scrollBottom(true);
	});
}

angular.module('arcanine.controllers').controller('DashboardCtrl', DashboardCtrl);