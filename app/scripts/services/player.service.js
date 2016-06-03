'use strict';

function PlayerService($firebaseObject, ENV) {
	return {
		ref: function(id) {
			return new Firebase(ENV.FIREBASE_URL + 'Player/' + id);
		},
		get: function(id) {
			return $firebaseObject(this.ref(id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		}
	};
}

angular.module('arcanine.services').factory('Player', PlayerService);