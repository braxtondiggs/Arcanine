'use strict';

function QueueCtrl($scope, $rootScope, $state, $ionicModal, $cordovaKeyboard, $cordovaDialogs, Queue) {
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

	vm.remove = function(track) {
		$cordovaDialogs.confirm('Are you sure you want to delete this video from the queue?', 'Alma', ['Delete','Cancel']).then(function(res) {
			if (res === 1) {
				Queue.remove(track).then(function (){
					$cordovaDialogs.alert('Your video has successfully been removed from the queue', 'Alma');
				});
			}
		});
	};

}

angular.module('arcanine.controllers').controller('QueueCtrl', QueueCtrl);