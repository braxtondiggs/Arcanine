'use strict';

function QueueService($rootScope, $http, $firebaseArray, $cordovaDialogs, lodash, Player, ENV) {
	function get(id) {
		return $firebaseArray(Player.ref(id).child('queue'));
	}

	function add(id, track) {
		if (check(track)) {
			$http({
				method: 'GET',
				url: ENV.apiEndpoint + 'artists/find/' + track.id,
			}).success(function(data) {
				data.user = $rootScope.user.id;
				get(id).$add(data).then(function() {
					$cordovaDialogs.alert('Your song is now in the queue!', 'Alma');
				});
			});
		} else {
			$cordovaDialogs.alert('Looks like this song is already in the Queue.', 'Alma - Error');
		}
	}

	function check(track) {
		return lodash.isUndefined(lodash.find($rootScope.queueList, function(o) {return o.id === track.id; }));
	}

	function remove(id, track) {
		return get(id).$remove(track);
	}

	var service = {
		get: get,
		check: check,
		remove: remove,
		add: add
	};

	return service;
}

angular.module('arcanine.services').factory('Queue', QueueService);