'use strict';

function appRoute($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl',
			controllerAs: 'main',
			resolve: {
				currentAuth: ['$rootScope', 'User', '$q', 'Auth', 'Queue', 'Loading', function($rootScope, User, $q, Auth, Queue, Loading) {
					Loading.show();
					var deferred = $q.defer();
					Auth.$waitForAuth().then(function(authData) {
						if (authData) {
							var id = (authData.provider !== 'password') ? authData[authData.provider].id : authData.uid;
							User.get(id).$loaded().then(function(user) {
								$rootScope.user = user;
								if (user.provider !== 'password') {
									$rootScope.user = user[user.provider];
								}
								Loading.hide();
								deferred.resolve(user);
							});
						} else {
							Loading.hide();
							deferred.resolve();
						}
					});
					return deferred.promise;
				}]

			}
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
		})
		.state('app.artist', {
			url: '/artist/:action/:artistId',
			views: {
				'menuContent': {
					templateUrl: 'templates/artist.html',
					controller: 'ArtistCtrl',
					controllerAs: 'artist',
					resolve: {
						'Artist': ['$q', '$stateParams', 'ArtistService', '$cordovaDialogs', '$ionicHistory', function($q, $stateParams, ArtistService, $cordovaDialogs, $ionicHistory) {
							function notFound() {
								$cordovaDialogs.alert('We are having trouble getting this artists information right now. Our data is constantly changing, so check back later', 'Alma - Error').then(function() {
									$ionicHistory.goBack(-1);
								});
							}
							var deferred = $q.defer();
							if ($stateParams.action === 'id') {
								ArtistService.getInfo($stateParams.artistId).then(function(artist) {
									deferred.resolve(artist);
								}, function(err) {
									notFound();
									deferred.reject(err);
								});
							} else if ($stateParams.action === 'slug') {
								ArtistService.getSlug($stateParams.artistId).then(function(artist) {
									deferred.resolve(artist);
								}, function(err) {
									notFound();
									deferred.reject(err);
								});
							}
							return deferred.promise;
						}]
					}
				}
			}
		})
		.state('app.venue', {
			url: '/venue',
			views: {
				'menuContent': {
					templateUrl: 'templates/venue.html',
					controller: 'VenueCtrl',
					controllerAs: 'venue'
				}
			}
		})
		.state('app.profile', {
			url: '/profile/:id',
			views: {
				'menuContent': {
					templateUrl: 'templates/profile.html',
					controller: 'ProfileCtrl',
					controllerAs: 'profile',
					resolve: {
						'profileUser': ['User', '$q', '$stateParams', 'Loading', function(User, $q, $stateParams, Loading) {
							Loading.show();
							var deferred = $q.defer();
							User.get($stateParams.id).$loaded().then(function(user) {
								Loading.hide();
								if (user.provider) {
									deferred.resolve(user);
								} else {
									deferred.reject();
								}
							});
							return deferred.promise;
						}]

					}
				}
			}
		})
		.state('app.settings', {
			url: '/settings',
			views: {
				'menuContent': {
					templateUrl: 'templates/settings.html',
					controller: 'SettingsCtrl',
					controllerAs: 'settings',
					resolve: {
						'currentAuth': ['Auth', function(Auth) {
							return Auth.$requireAuth();
						}]
					}
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