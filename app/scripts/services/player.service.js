'use strict';

function PlayerService($rootScope, $firebaseObject, $q, $state, $firebaseArray, $ionicPopup, ENV, User) {
	return {
		ref: function(id) {
			var _id = id || (($rootScope.user && $rootScope.user.connected)?$rootScope.user.connected:null);
			return new Firebase(ENV.FIREBASE_URL + 'Player/' + _id);
		},
		get: function(id) {
			var _id = id || $rootScope.user.connected;
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
				$ionicPopup.alert({
					template: 'You have not connected to an Alma yet.',
					title: 'Alma - Error'
				}).then(function() {
					$state.transitionTo('app.venue');
					deferred.reject();
				});
			}
			return deferred.promise;
		}
	};
}

angular.module('arcanine.services').factory('Player', PlayerService);