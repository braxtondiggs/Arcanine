'use strict';

function LoginCtrl($rootScope, $ionicPopup, Auth, User, Loading) {
	var vm = this;
	vm.auth = Auth;

	vm.signup = {
		form: {}
	};
	vm.login = {
		form: {}
	};
	vm.login.submit = function() {
		if (vm.login.form.$valid) {
			Loading.show();
			Auth.$authWithPassword({
				email: vm.login.form.lemail.$viewValue,
				password: vm.login.form.lpassword.$viewValue
			}).then(function(userData) {
				User.update(userData.password).then(function() {
					vm.login = {};
					vm.signup = {};
					$rootScope.closeLogin();
					Loading.hide();
				}).catch(function(err) {
					vm.login.error = err;
					Loading.hide();
				});
			}).catch(function(err) {
				vm.login.error = err;
				Loading.hide();
			});
		}
	};
	vm.signup.submit = function() {
		if (vm.signup.form.$valid) {
			Auth.$createUser({
				email: vm.signup.form.semail.$viewValue,
				password: vm.signup.form.spassword.$viewValue
			}).then(function() {
				Auth.$authWithPassword({
					email: vm.signup.form.semail.$viewValue,
					password: vm.signup.form.spassword.$viewValue
				}).then(function(userData) {
					userData.password.id = userData.uid;
					userData.password.accessToken = userData.token;
					userData.password.displayName = vm.signup.form.sname.$viewValue;
					userData.password.provider = 'Password';
					User.update(userData.password).then(function() {
						vm.login = {};
						vm.signup = {};
						$rootScope.closeLogin();
						Loading.hide();
					}).catch(function(err) {
						vm.signup.error = err;
						Loading.hide();
					});
				}).catch(function(err) {
					vm.signup.error = err;
					Loading.hide();
				});
			}).catch(function(err) {
				vm.signup.error = err;
				Loading.hide();
			});
		}
	};
	vm.facebook = function() {
		function createFacebook(authData) {
			authData.facebook.provider = 'facebook';
			User.update(authData.facebook).then(function() {
				$rootScope.closeLogin();
				Loading.hide();
			});
		}
		Auth.$authWithOAuthPopup('facebook', { scope: 'public_profile, email, user_friends, user_birthday' }).then(function(userData) {
			createFacebook(userData);
		}).catch(function(error) {
			if (error.code === 'TRANSPORT_UNAVAILABLE') {
				Auth.$authWithOAuthPopup('facebook', { scope: 'public_profile, email, user_friends, user_birthday' }).then(function(userData) {
					createFacebook(userData);
				});
			}
		});
	};
	vm.twitter = function() {
		function createTwitter(authData) {
			authData.twitter.provider = 'twitter';
			User.update(authData.twitter).then(function() {
				$rootScope.closeLogin();
				Loading.hide();
			});
		}
		Auth.$authWithOAuthPopup('twitter').then(function(userData) {
			createTwitter(userData);
		}).catch(function(error) {
			if (error.code === 'TRANSPORT_UNAVAILABLE') {
				Auth.$authWithOAuthPopup('twitter').then(function(userData) {
					createTwitter(userData);
				});
			}
		});
	};
	vm.forgotPassword = function() {
		if (vm.login.form.lemail.$valid) {
			Auth.$resetPassword({
				email: vm.login.form.lemail.$viewValue
			}).then(function() {
				$ionicPopup.alert({
					template: 'Password reset email sent successfully!',
					title: 'Alma'
				});
			}).catch(function(error) {
				$ionicPopup.alert({
					template: error,
					title: 'Alma'
				});
			});
		}
	};
	vm.formChange = function() {
		vm.login.error = null;
		vm.signup.error = null;
	};
}

angular.module('arcanine.controllers').controller('LoginCtrl', LoginCtrl);