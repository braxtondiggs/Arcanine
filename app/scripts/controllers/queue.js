'use strict';

function QueueCtrl($scope, $rootScope, $state, $ionicModal, $cordovaKeyboard, $cordovaDialogs, lodash, Queue) {
	var vm = this;
	$rootScope.votes = {};
	$rootScope.$watch('user.connected', function(conn) {
		if (conn) {
			Queue.get().$loaded().then(function(queue) {
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
		$cordovaDialogs.confirm('Are you sure you want to delete this video from the queue?', 'Alma', ['Delete', 'Cancel']).then(function(res) {
			if (res === 1) {
				Queue.remove(track).then(function() {
					$cordovaDialogs.alert('Your video has successfully been removed from the queue', 'Alma');
				});
			}
		});
	};

	vm.vote = function(track, vote) {
		Queue.vote(track.$id, vote);
	};
	vm.status = function(vote) {
		return (!angular.isDefined(vote)) ? false : !vote;
	};

}

angular.module('arcanine.controllers').controller('QueueCtrl', QueueCtrl);