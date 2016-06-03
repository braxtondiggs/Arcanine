'use strict';

function appRoute($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl',
			controllerAs: 'main'
		})
		.state('app.dashboard', {
			url: '/dashboard',
			views: {
				'menuContent': {
					templateUrl: 'templates/dashboard.html',
					controller: 'DashboardCtrl',
					controllerAs: 'dashboard'
				}
			}
		})
		.state('app.discover', {
			url: '/discover',
			views: {
				'menuContent': {
					templateUrl: 'templates/discover.html',
					controller: 'DiscoverCtrl',
					controllerAs: 'discover'
				}
			}
		}).state('app.search', {
			url: '/search',
			views: {
				'menuContent': {
					templateUrl: 'templates/search.html',
					controller: 'SearchCtrl',
					controllerAs: 'search'
				}
			}
		}).state('app.venue', {
			url: '/venue',
			views: {
				'menuContent': {
					templateUrl: 'templates/venue.html',
					controller: 'VenueCtrl',
					controllerAs: 'venue'
				}
			}
		});
	$urlRouterProvider.otherwise('/app/dashboard');
	$ionicConfigProvider.tabs.position('top');
	$ionicConfigProvider.views.swipeBackEnabled(true);
}

function appRate($cordovaAppRateProvider, $document) {
	var prefs = {
		language: 'en',
		appName: 'Alma',
		iosURL: '992255249',
		usesUntilPrompt: 5,
		promptForNewVersion: true,
		androidURL: 'market://details?id=com.cymbit.Alma'
	};

	$document.addEventListener('deviceready', function() {
		$cordovaAppRateProvider.setPreferences(prefs);
	}, false);
}

function appIdentify($ionicAppProvider) {
	$ionicAppProvider.identify({
		app_id: 'e1f80125',
		api_key: '78e1608ca9a8dad91cc3b4f896981b65d82055083a70cee2'
	});
}


angular.module('arcanine.config')
	.config(appRoute);
	//.config(appRate)
	//.config(appIdentify);