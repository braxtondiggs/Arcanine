'use strict';

function ArtistCtrl($rootScope, Artist, ArtistService, Queue, Utils) {
	var vm = this;
	vm.info = Artist;

	vm.getBio = function() {
		if (!vm.bio) {
			ArtistService.getBio(vm.info.convertedSlug).the(function(bio) {
				vm.bio = bio;
			});
		}
	};
	vm.getRelated = function() {
		if (!vm.related) {
			ArtistService.getRelated(vm.info.convertedSlug).then(function(related) {
				vm.related = related;
			});
		}
	};
	vm.contact = function(slug) {
		console.log(slug);
	};
	vm.toSlug = function(name) {
		return Utils.toSlug(name);
	};
	$rootScope.queue = function(video) {
		Queue.add(video);
	};
}

angular.module('arcanine.controllers').controller('ArtistCtrl', ArtistCtrl);