'use strict';

function VenueCtrl($scope, $rootScope, $state, $http, $firebaseArray, $cordovaGeolocation, $geolocation, $cordovaDialogs, $ionicHistory, $ionicScrollDelegate, lodash, Loading, Auth, ENV, User, Utils, Player, currentAuth) {
	var vm = this;
	vm.auth = Auth;
	vm.players = {};
	vm.loaded = false;
	vm.manual = false;
	vm.location = {};
	var geoFire = new GeoFire(new Firebase(ENV.FIREBASE_URL + 'Locations/Player'));
	$rootScope.user = currentAuth;

	$scope.$watch(angular.bind(this, function() {
		return this.location;
	}), function(location) {
		if (!lodash.isEmpty(location)) {
			if ($rootScope.user && $rootScope.user.id) {
				var obj = {
					id: $rootScope.user.id,
					location: vm.location
				};
				User.update(obj);
			}
			var query = geoFire.query({
				center: [location.lat, location.lng],
				radius: 24 //15mi
			});
			query.on('ready', function() {
				Loading.hide();
				vm.loaded = true;
				vm.manual = false;
				$scope.$broadcast('scroll.refreshComplete');
			});
			query.on('key_entered', function(key, location, distance) {
				Player.get(key).$loaded().then(function(venue) {
					venue.distance = distance;
					vm.players[venue.$id] = venue;
				});
			});
		}
	});

	vm.getLocation = function() {
		Loading.show();
		/*$cordovaGeolocation.getCurrentPosition({
			timeout: 10000,
			enableHighAccuracy: false
		}).then(function(position) {
			vm.location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		}, function() {
			$scope.$broadcast('scroll.refreshComplete');
			Loading.hide();
			vm.loaded = true;
		});*/
		$geolocation.getCurrentPosition({
			timeout: 10000
		}).then(function(position) {
			console.log(position);
			vm.location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		});
	};
	vm.unitConvert = function(unit, m) {
		return Utils.unitConvert(unit, m);
	};

	vm.refresh = function() {
		vm.loaded = false;
		vm.getLocation();
	};
	vm.reset = function() {
		vm.manual = true;
		$ionicScrollDelegate.scrollBottom(true);
	};
	vm.find = function(location) {
		Loading.show();
		$http.get('http://nominatim.openstreetmap.org/search', {
			params: {
				q: location,
				format: 'json',
				addressdetails: 1
			}
		}).then(function(response) {
			if (response.data[0]) {
				vm.players = [];
				vm.location = { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
				vm.manual = false;
				$ionicScrollDelegate.scrollTop(true);
			}
			Loading.hide();
		});
	};
	vm.join = function(player) {
		function connect() {
			Player.ref(player.$id).child('connected/' + $rootScope.user.id).set({
				name: $rootScope.user.displayName,
				image: $rootScope.user.profileImageURL
			}).then(function() {
				var obj = {
					id: $rootScope.user.id,
					connected: player.$id
				};
				User.update(obj);
				$cordovaDialogs.alert('You have succesfully connect to this player', 'Alma').then(function() {
					$state.transitionTo('app.dashboard');
					$ionicHistory.nextViewOptions({
						historyRoot: true
					});
				});
			});
		}

		function disconnect(rooms, callback) {
			if (!lodash.isNull(rooms.$getRecord($rootScope.user.id))) {
				var room = rooms.$getRecord($rootScope.user.id);
				rooms.$remove(room).then(function() {
					var obj = {
						id: $rootScope.user.id,
						connected: null
					};
					User.update(obj);
					callback();
				}, function(err) {
					console.log(err);
				});
			} else {
				callback();
			}
		}
		$cordovaDialogs.confirm('Are you sure you want to connect to this player?', 'Alma', ['Connect', 'Cancel']).then(function(res) {
			if (res === 1) {
				Player.getConnected(player.$id).$loaded().then(function(rooms) {
					if ($rootScope.user.connected) {
						if (lodash.isNull(rooms.$getRecord($rootScope.user.id)) || $rootScope.user.id !== rooms.$getRecord($rootScope.user.id).$id) {
							disconnect(rooms, function() {
								connect();
							});
						}
					} else {
						connect();
					}
				});
			}
		});
	};
	vm.getLocation();
}

angular.module('arcanine.controllers').controller('VenueCtrl', VenueCtrl);