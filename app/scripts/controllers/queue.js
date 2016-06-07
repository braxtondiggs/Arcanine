'use strict';

function QueueCtrl($scope, $rootScope, $state, $ionicModal, $cordovaKeyboard, Queue) {
	var vm = this;
	$rootScope.$watch('user.connected', function(conn) {
		if (conn) {
			Queue.get(conn.player).$loaded().then(function(queue) {
				$rootScope.queueList = queue;
			});
		}
	});

	$ionicModal.fromTemplateUrl('templates/modal/queue.tmpl.html', {
		scope: $scope,
		controller: 'QueueCtrl',
		controllerAs: 'queue',
		animation: 'slide-in-up'
	}).then(function(modal) {
		vm.modal = modal;
	});
	vm.goto = function(id) {
		vm.close();
		$state.transitionTo('app.artist', { action: 'slug', artistId: id });
	};
	vm.close = function() {
		vm.modal.hide().then(function() {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				$cordovaKeyboard.disableScroll(false);
			}
		});
	};
	vm.open = function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			$cordovaKeyboard.disableScroll(true);
		}
		vm.modal.show();
	};

}

angular.module('arcanine.controllers').controller('QueueCtrl', QueueCtrl);