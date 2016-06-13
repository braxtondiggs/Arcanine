'use strict';

function QueueService($rootScope, $http, $firebaseArray, $firebaseObject, $cordovaDialogs, lodash, Loading, Player, ENV) {
	function ref() {
		return Player.ref().child('queue');
	}

	function refTrack(trackId) {
		return ref().child(trackId);
	}

	function refAllVotes(trackId) {
		return refTrack(trackId).child('votes');
	}

	function refVote(trackId) {
		return refAllVotes(trackId).child($rootScope.user.id);
	}

	function get() {
		return $firebaseArray(ref());
	}

	function getVotes(trackId) {
		return $firebaseArray(refAllVotes(trackId));
	}

	function add(track) {
		$cordovaDialogs.confirm('Are you sure you want add this song?', 'Alma').then(function(res) {
			if (res === 1) {
				if (check(track)) {
					Loading.show();
					$http({
						method: 'GET',
						url: ENV.apiEndpoint + 'artists/find/' + track.id,
					}).success(function(data) {
						data.user = {
							id: $rootScope.user.id,
							name: $rootScope.user.displayName
						};
						data.priority = 0;
						get().$add(data).then(function() {
							$cordovaDialogs.alert('Your song is now in the queue!', 'Alma');
							Loading.hide();
						});
					});
				} else {
					$cordovaDialogs.alert('Looks like this song is already in the Queue.', 'Alma - Error');
				}
			}
		});
	}

	function check(track) {
		return lodash.isUndefined(lodash.find($rootScope.queueList, function(o) {
			return o.id === track.id;
		}));
	}

	function remove(track) {
		return get().$remove(track);
	}

	function vote(trackId, status) {
		refTrack(trackId).once('value', function(snapshot) {
			if (status !== snapshot.child('votes/' + $rootScope.user.id + '/status').val()) {
				var incr = (Boolean(status)) ? 1 : -1;
				var prior = parseInt(snapshot.getPriority(), 10) || 0;
				prior += incr;
				snapshot.child('votes/' + $rootScope.user.id).ref().set({
					user: {
						name: $rootScope.user.displayName,
						image: $rootScope.user.profileImageURL
					},
					status: status
				});
				snapshot.child('priority').ref().set(prior);
			}
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