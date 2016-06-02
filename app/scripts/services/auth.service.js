'use strict';

function AuthService($firebaseAuth, ENV) {
	var usersRef = new Firebase(ENV.FIREBASE_URL + '/url');
	return $firebaseAuth(usersRef);
}

angular.module('arcanine.services').factory('Auth', AuthService);