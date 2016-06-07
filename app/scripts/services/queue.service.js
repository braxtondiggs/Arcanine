'use strict';

function QueueService($q, $http, $firebaseArray, Player, ENV) {
	function get(id) {
		return $firebaseArray(Player.ref(id).child('queue'));
	}
	function add(id, track) {
		return get(id).$add(track);
		
	}
	function check(track) {
	}
	function remove(track) {
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