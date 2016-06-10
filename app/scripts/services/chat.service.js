'use strict';

function ChatService($firebaseArray, Player) {
	function ref() {
		return Player.ref().child('chat');
	}
	function get() {
		return $firebaseArray(ref());
	}

	var service = {
		ref: ref,
		get: get
	};

	return service;
}

angular.module('arcanine.services').factory('Chat', ChatService);