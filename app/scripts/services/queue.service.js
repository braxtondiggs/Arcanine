'use strict';

function QueueService($rootScope, $http, $firebaseArray, $firebaseObject, $cordovaDialogs, lodash, Loading, Player, User, ENV) {
	function ref(id) {
		return Player.ref(id).child('queue');
	}

	function refTrack(id, trackId) {
		return ref(id).child(trackId);
	}

	function refAllVotes(id, trackId) {
		return refTrack(id, trackId).child('votes');
	}

	function refVote(id, trackId) {
		return refAllVotes(id, trackId).child($rootScope.user.id);
	}

	function get(id) {
		return $firebaseArray(ref(id));
	}

	function getVotes(id, trackId) {
		return $firebaseArray(refAllVotes(id, trackId));
	}

	function add(track) {
		User.auth($rootScope.user).then(function() {
			$cordovaDialogs.confirm('Are you sure you want add this song?', 'Alma').then(function(res) {
				if (res === 1) {
					if (check(track)) {
						Loading.show();
						$http({
							method: 'GET',
							url: ENV.apiEndpoint + 'artists/find/' + track.id,
						}).success(function(data) {
							data.user = $rootScope.user.id;
							get($rootScope.user.connected.player).$add(data).then(function() {
								$cordovaDialogs.alert('Your song is now in the queue!', 'Alma');
								Loading.hide();
							});
						});
					} else {
						$cordovaDialogs.alert('Looks like this song is already in the Queue.', 'Alma - Error');
					}
				}
			});
		});
	}

	function check(track) {
		return lodash.isUndefined(lodash.find($rootScope.queueList, function(o) {
			return o.id === track.id;
		}));
	}

	function remove(id, track) {
		return get(id).$remove(track);
	}

	function vote(id, trackId, status) {
		User.auth($rootScope.user).then(function() {
			refTrack(id, trackId).once('value', function(snapshot) {
				if (status !== snapshot.child('votes/' + $rootScope.user.id).val()) {
					var incr = (Boolean(status)) ? 1 : -1;
					var prior = parseInt(snapshot.getPriority(), 10);
					prior += incr;
					snapshot.child('votes/' + $rootScope.user.id).ref().set(status);
					snapshot.ref().setPriority(prior);
				}
			});
		});
	}

	var service = {
		getVotes: getVotes,
		get: get,
		check: check,
		remove: remove,
		add: add,
		vote: vote
	};

	return service;
}

angular.module('arcanine.services').factory('Queue', QueueService);