'use strict';

function LoginCtrl($rootScope, Auth, User, Loading) {
	var vm = this;
	vm.auth = Auth;
	vm.auth.$onAuth(function(authData) {
		if (authData) {
			$rootScope.user = authData[authData.provider];
			console.log($rootScope.user);
		}
	});

	vm.signup = {
		form: {}
	};
	vm.login = vm.signup;
	vm.login.submit = function() {
		if (vm.login.form.$valid) {
			Loading.show();
			Auth.$authWithPassword({
				email: vm.login.form.email.$viewValue,
				password: vm.login.form.password.$viewValue
			}).then(function(userData) {
				User.update(userData.password).then(function() {
					vm.login = {};
					vm.signup = vm.login;
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
				email: vm.signup.form.email.$viewValue,
				password: vm.signup.form.password.$viewValue
			}).then(function() {
				Auth.$authWithPassword({
					email: vm.signup.form.email.$viewValue,
					password: vm.signup.form.password.$viewValue
				}).then(function(userData) {
					userData.password.id = userData.uid;
					userData.password.accessToken = userData.token;
					userData.password.displayName = vm.signup.form.name.$viewValue;
					userData.password.provider = 'Password';
					User.update(userData.password).then(function() {
						vm.login = {};
						vm.signup = vm.login;
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

	};
	vm.formChange = function () {
		vm.login.error = null;
		vm.signup.error = null;
	};
	vm.forgetPassword = function() {

	};
}

angular.module('arcanine.controllers').controller('LoginCtrl', LoginCtrl);