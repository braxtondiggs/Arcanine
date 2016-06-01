'use strict';

function AuthService($firebaseAuth, FIREBASE_URL) {
	var usersRef = new Firebase(FIREBASE_URL + '/url');
	return $firebaseAuth(usersRef);
}

angular.module('arcanine.services').factory('Auth', AuthService);