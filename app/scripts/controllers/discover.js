'use strict';

function DiscoverCtrl(lodash, $state, $http, $firebaseObject, $cordovaDialogs, ENV, Loading, Queue, currentAuth) {
	var vm = this;
	vm.user = currentAuth;
	vm.get = function(sort) {
		if (lodash.isUndefined(vm[sort])) {
			vm[sort] = {
				loaded: false
			};
			Loading.show();
			var obj = $firebaseObject(new Firebase(ENV.FIREBASE_URL + 'Discover/' + sort));

			obj.$loaded(function() {
				if (!obj || !obj.tracks || obj.tracks.length === 0 || moment(new Date(obj.date)).isBefore(new Date(), 'day')) {
					$http({
						method: 'GET',
						url: ENV.apiEndpoint + 'tracks/discover/' + sort,
					}).success(function(data) {
						vm[sort].tracks = data;
					});
				} else {
					vm[sort].tracks = obj.tracks;
				}
			}).then(function() {
				vm[sort].loaded = true;
				Loading.hide();
			});
		}
	};
	vm.add = function(track) {
		if (vm.user) {
			if (vm.user.connected) {
				$cordovaDialogs.confirm('Are you sure you want add this song?', 'Alma').then(function(res) {
					if (res === 1) {
						Loading.show();
						$http({
							method: 'GET',
							url: ENV.apiEndpoint + 'search',
							params: {
								pg: 1,
								q: track.slug + ' ' + track.slugTitle,
								s: 'videos'
							}
						}).success(function(data) {
							Queue.add(vm.user.connected.player, data.results[0]);
							Loading.hide();
						});
					}
				});
			} else {
				$cordovaDialogs.alert('You have not connected to an Alma yet.', 'Alma - Error').then(function() {
					$state.transitionTo('app.venue');
				});
			}
		}
	};
}

angular.module('arcanine.controllers').controller('DiscoverCtrl', DiscoverCtrl);