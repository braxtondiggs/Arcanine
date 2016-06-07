'use strict';

function ArtistCtrl($rootScope, $cordovaDialogs, Artist, ArtistService, Queue, Utils, currentAuth) {
	var vm = this;
	vm.info = Artist;
	vm.user = currentAuth;

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
		if(vm.user) {
			if(vm.user.connected.player) {
				$cordovaDialogs.confirm('Are you sure you want add this song?', 'Alma').then(function(res) {
					if (res === 1) {
						Queue.add(vm.user.connected.player, video).then(function(track) {
							console.log(track);
						});
					}
				});
			}
		}

	};
}

angular.module('arcanine.controllers').controller('ArtistCtrl', ArtistCtrl);