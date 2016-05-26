'use strict';

function appConfig($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl',
			controllerAs: 'main'
		})
		.state('app.browse', {
			url: '/browse',
			views: {
				'menuContent': {
					templateUrl: 'templates/browse.html' //,
						//controller: 'HomeCtrl'
				}
			}
		});
	$urlRouterProvider.otherwise('/app');
}


angular.module('arcanine.config', []).config(appConfig);