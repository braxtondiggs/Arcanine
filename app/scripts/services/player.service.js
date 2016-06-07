'use strict';

function PlayerService($firebaseObject, $firebaseArray, ENV) {
	return {
		ref: function(id) {
			return new Firebase(ENV.FIREBASE_URL + 'Player/' + id);
		},
		get: function(id) {
			return $firebaseObject(this.ref(id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		},
		refConnected: function(id) {
			return this.ref(id).child('connected');
		},
		getConnected: function(id) {
			return $firebaseArray(this.refConnected(id));
		},
		getConnected2: function(id, id2) {
			return $firebaseArray(this.refConnected(id).child(id2));
		}
	};
}

angular.module('arcanine.services').factory('Player', PlayerService);