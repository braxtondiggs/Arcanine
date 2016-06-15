'use strict';

function SettingsCtrl($rootScope, $q, $state, $ionicPopup, $cordovaAppVersion, $cordovaEmailComposer, $localStorage, $ionicHistory, Auth, User, Loading, currentAuth) {
	var vm = this;
	$rootScope.user = currentAuth;
	vm.submit = function() {
		function changeEmail() {
			if (vm.form.email.$dirty) {
				Auth.$changeEmail({
					oldEmail: 'my@email.com',
					newEmail: vm.form.email.$viewValue,
					password: 'mypassword'
				}).then(function() {
					console.log('Email changed successfully!');
				}).catch(function(error) {
					console.error('Error: ', error);
				});
			}
		}

		function changePassword() {
			if (vm.form.password.$dirty) {
				Auth.$changePassword({
					email: vm.form.email.$viewValue,
					oldPassword: 'mypassword',
					newPassword: vm.form.password.$viewValue
				}).then(function() {
					console.log('Password changed successfully!');
				}).catch(function(error) {
					console.error('Error: ', error);
				});
			}
		}

		function updateUser() {
			if (vm.form.gender.$dirty) {
				$rootScope.user.gender = vm.form.gender.$viewValue;
				User.update($rootScope.user).then(function(user) {
					console.log(user);
				});
			}
		}
		if (vm.form.$valid) {
			$q.all([
				changeEmail(),
				changePassword(),
				updateUser()
			]).then(function() {
				console.log('done');
			}).catch(function() {
				console.log('error');
			});
		}
	};
	vm.deleteAccount = function() {
		$ionicPopup.confirm({
			template: 'Deleting your account will also remove all of your library data. This is permanent and cannout be undone. Are your sure?',
			title: 'Delete Your Account',
			cancelText: 'Cancel',
			okText: 'Yes'
		}).then(function(res) {
			if (res) {
				Loading.show();
				Auth.$removeUser({
					email: $rootScope.user.email,
					password: 'mypassword'
				}).then(function() {
					$localStorage.$reset();
					$state.transitionTo('app.dashboard');
					$ionicHistory.clearHistory();
					Loading.hide();
					delete $rootScope.user;
					delete $rootScope.queueList;
				}).catch(function(error) {
					console.error('Error: ', error);
				});
			}
		});
	};
}

angular.module('arcanine.controllers').controller('SettingsCtrl', SettingsCtrl);