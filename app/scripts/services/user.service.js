'use strict';

function UserService($rootScope, $q, $state, $firebaseObject, $cordovaDialogs, ENV) {
	return {
		ref: function(id) {
			return new Firebase(ENV.FIREBASE_URL + 'Users/' + id);
		},
		get: function(id) {
			return $firebaseObject(this.ref(id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		},
		auth: function(user) {
			var deferred = $q.defer();
			if (user) {
				if (user.connected) {
					deferred.resolve();
				} else {
					$cordovaDialogs.alert('You have not connected to an Alma yet.', 'Alma - Error').then(function() {
						$state.transitionTo('app.venue');
						deferred.reject();
					});
				}
			} else {
				$cordovaDialogs.alert('You need to be logged in inorder to complete this action', 'Alma - Error').then(function() {
					$rootScope.openLogin();
					deferred.reject();
				});
			}
			return deferred.promise;
		}
	};
}


angular.module('arcanine.services').factory('User', UserService);