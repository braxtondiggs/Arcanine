'use strict';

function UserService($rootScope, $q, $state, $firebaseObject, $cordovaDialogs, ENV) {
	return {
		ref: function(id) {
			var _id = id || $rootScope.user.connected.player;
			return new Firebase(ENV.FIREBASE_URL + 'Users/' + _id);
		},
		get: function(id) {
			var _id = id || $rootScope.user.id;
			return $firebaseObject(this.ref(_id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		},
		auth: function() {
			var deferred = $q.defer(),
				user = $rootScope.user;
			if (user) {
				deferred.resolve();
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