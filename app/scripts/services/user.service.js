'use strict';

function UserService($firebaseObject, ENV) {
	return {
		ref: function(id) {
			return new Firebase(ENV.FIREBASE_URL + 'Users/' + id);
		},
		get: function(id) {
			return $firebaseObject(this.ref(id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		}
	};
}


angular.module('arcanine.services').factory('User', UserService);