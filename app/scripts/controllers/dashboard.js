'use strict';

function DashboardCtrl($rootScope, $state, Chat, currentAuth) {
	var vm = this;
	$rootScope.user = currentAuth;
	if ($rootScope.user && $rootScope.user.connected) {
		Chat.get().$loaded().then(function(chats) {
			vm.chats = chats;
		});
	}

	vm.tutorial = function() {
		$state.transitionTo('app.venue');
	};
}

angular.module('arcanine.controllers').controller('DashboardCtrl', DashboardCtrl);