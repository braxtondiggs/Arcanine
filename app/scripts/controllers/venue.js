'use strict';

function VenueCtrl($scope, $http, $cordovaGeolocation, $cordovaDialogs, $ionicScrollDelegate, lodash, Loading, Auth, ENV, User, Utils, Player) {
	var vm = this;
	vm.auth = Auth;
	vm.user = {};
	vm.players = [];
	vm.loaded = false;
	vm.manual = false;
	var geoFire = new GeoFire(new Firebase(ENV.FIREBASE_URL + 'Locations/Player'));
	vm.auth.$onAuth(function(authData) {
		if (authData) {
			vm.user = authData[authData.provider];
		}
		vm.getLocation();
	});

	$scope.$watch(angular.bind(this, function() {
		return this.user.location;
	}), function(location, old) {
		if (!lodash.isUndefined(location)) {
			User.update(vm.user);
			var query = geoFire.query({
				center: [location.lat, location.lng],
				radius: 24 //15mi
			});
			query.on('ready', function() {
				Loading.hide();
				vm.loaded = true;
			});
			query.on('key_entered', function(key, location, distance) {
				Player.get(key).$loaded().then(function(venue) {
					venue.distance = distance;
					vm.players.push(venue);
				});
			});
		}
	});

	vm.getLocation = function() {
		Loading.show();
		$cordovaGeolocation.getCurrentPosition({
			timeout: 10000,
			enableHighAccuracy: false
		}).then(function(position) {
			vm.user.location = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		}, function() {
			$scope.$broadcast('scroll.refreshComplete');
			Loading.hide();
			vm.loaded = true;
		});
	};
	vm.unitConvert = function(unit, m) {
		return Utils.unitConvert(unit, m);
	};

	vm.refresh = function() {
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
				vm.user.location = { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
				vm.manual = false;
				$ionicScrollDelegate.scrollTop(true);
			}
			Loading.hide();
		});
	};
	vm.join = function(index) {
		$cordovaDialogs.confirm('Are you sure you want to connect to this player?', 'Alma', ['Connect', 'Cancel']).then(function(res) {
			if (res ===1) {
			}
		});
	};
}

angular.module('arcanine.controllers').controller('VenueCtrl', VenueCtrl);