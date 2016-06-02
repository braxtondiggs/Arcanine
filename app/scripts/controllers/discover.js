'use strict';

function DiscoverCtrl($http, $firebaseObject, ENV, Loading, lodash) {
	var vm = this;
	vm.get = function(sort) {
		if (lodash.isUndefined(vm[sort])) {
			vm[sort] = {
				loaded: false
			};
			Loading.show();
			var obj = $firebaseObject(new Firebase(ENV.FIREBASE_URL + 'Discover/' + sort));

			obj.$loaded(function() {
				if (obj && obj.tracks.length === 0 && moment(new Date(obj.date)).isBefore(new Date(), 'day')) {
					$http({
						method: 'GET',
						url: ENV.apiEndpoint + 'tracks/discover/' + sort
					}).success(function(data){
						vm[sort].tracks = data;
						vm[sort].loaded = true;
						Loading.hide();
					});
				}else {
					vm[sort].tracks = obj.tracks;
					vm[sort].loaded = true;
					Loading.hide();
				}
			});
		}
	};
}

angular.module('arcanine.controllers').controller('DiscoverCtrl', DiscoverCtrl);