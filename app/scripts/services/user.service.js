'use strict';

function UserService($firebaseObject, FIREBASE_URL) {
	return {
		ref: function(id) {
			return new Firebase(FIREBASE_URL + 'Users/' + id);
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