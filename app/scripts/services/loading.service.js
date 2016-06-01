'use strict';

function LoadingService($ionicLoading, cfpLoadingBar) {
	function show() {
		cfpLoadingBar.start();
		cfpLoadingBar.inc();
		$ionicLoading.show({
			animation: 'fade-in',
			hideOnStateChange: true,
			showBackdrop: false
		});
	}

	function hide() {
		$ionicLoading.hide();
		cfpLoadingBar.complete();
	}

	var service = {
		show: show,
		hide: hide
	};

	return service;
}

angular.module('arcanine.services', []).factory('Loading', LoadingService);