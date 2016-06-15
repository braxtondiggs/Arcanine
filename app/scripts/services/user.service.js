'use strict';

function UserService($rootScope, $q, $state, $firebaseObject, $ionicPopup, ENV) {
	return {
		ref: function(id) {
			var _id = id || (($rootScope.user && $rootScope.user.connected)?$rootScope.user.connected:null);
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
				$ionicPopup.alert({
					template: 'You need to be logged in inorder to complete this action',
					title: 'Alma - Error'
				}).then(function() {
					$rootScope.openLogin();
					deferred.reject();
				});
			}
			return deferred.promise;
		}
	};
}


angular.module('arcanine.services').factory('User', UserService);