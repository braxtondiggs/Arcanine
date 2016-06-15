'use strict';

function QueueService($rootScope, $http, $firebaseArray, $firebaseObject, $ionicPopup, lodash, Loading, Player, ENV) {
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
		Player.auth().then(function() {
			$ionicPopup.confirm({
				title: 'Alma',
				template: 'Are you sure you want add this song?'
			}).then(function(res) {
				if (res) {
					if (check(track)) {
						Loading.show();
						$http({
							method: 'GET',
							url: ENV.apiEndpoint + 'artists/find/' + track.id,
						}).success(function(data) {
							var src = lodash.filter(data.sources, ['source', 'youtube']);
							if (src.length > 0) {
								data.user = {
									id: $rootScope.user.id,
									name: $rootScope.user.displayName
								};
								data.priority = 0;
								get().$add(data).then(function() {
									$ionicPopup.alert({
										template: 'Your song is now in the queue!',
										title: 'Alma'
									});
									Loading.hide();
								});
							}else {
								Loading.hide();
								$ionicPopup.alert({
									template: 'This song could not be added at this time, try again.',
									title: 'Alma - Internal Error'
								});
							}
						});
					} else {
						$ionicPopup.alert({
							template: 'Looks like this song is already in the Queue.',
							title: 'Alma - Error'
						});
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

	function remove(track) {
		return get().$remove(track);
	}

	function vote(trackId, status) {
		refTrack(trackId).once('value', function(snapshot) {
			if (status !== snapshot.child('votes/' + $rootScope.user.id + '/status').val()) {
				var incr = (Boolean(status)) ? 1 : -1;
				var prior = parseInt(snapshot.val().priority, 10) || 0;
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