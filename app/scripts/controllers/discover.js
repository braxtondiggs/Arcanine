'use strict';

function DiscoverCtrl(lodash, $http, $firebaseObject, ENV, Loading, Queue) {
	var vm = this;
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
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'search',
			params: {
				pg: 1,
				q: track.slug + ' ' + track.slugTitle,
				s: 'videos'
			}
		}).success(function(data) {
			Queue.add(data.results[0]);
		});
	};
}

angular.module('arcanine.controllers').controller('DiscoverCtrl', DiscoverCtrl);