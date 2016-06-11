'use strict';

function PlayerService($rootScope, $firebaseObject, $q, $state, $firebaseArray, $cordovaDialogs, ENV, User) {
	return {
		ref: function(id) {
			var _id = id || $rootScope.user.connected.player;
			return new Firebase(ENV.FIREBASE_URL + 'Player/' + _id);
		},
		get: function(id) {
			var _id = id || $rootScope.user.connected.player;
			return $firebaseObject(this.ref(_id));
		},
		update: function(obj) {
			User.auth().then(function() {
				this.auth().then(function() {
					return this.ref().update(obj);
				});
			});
		},
		refConnected: function(id) {
			return this.ref(id).child('connected');
		},
		getConnected: function(id) {
			return $firebaseArray(this.refConnected(id));
		},
		auth: function() {
			var deferred = $q.defer(),
				user = $rootScope.user;
			if (user.connected) {
				deferred.resolve();
			} else {
				$cordovaDialogs.alert('You have not connected to an Alma yet.', 'Alma - Error').then(function() {
					$state.transitionTo('app.venue');
					deferred.reject();
				});
			}
			return deferred.promise;
		}
	};
}

angular.module('arcanine.services').factory('Player', PlayerService);