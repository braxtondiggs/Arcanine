'use strict';

function ArtistService($q, $http, Utils, Loading, ENV) {
	function getInfo(id) {
		var deferred = $q.defer();
		Loading.show();
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'artists/id/' + id
		}).success(function(data) {
			Loading.hide();
			deferred.resolve({
				id: data.discogs_id,
				name: data.name,
				slug: data.slug,
				img: data.image,
				convertedSlug: Utils.convertSlug(data.name, data.slug),
				artistStyles: (Utils.convertSlug(data.name, data.slug).indexOf('logo_missing.png') > -1) ? 'emptyArtist' : '',
				checkedImage: Utils.checkImage(data.image),
				videography: data.artist_videos.videos,
				featured: data.featured_artist_videos.videos,
				style: { 'background-image': 'url(' + Utils.checkImage(data.image) + ')' },
			});
		}).error(function() {
			deferred.reject();
		});
		return deferred.promise;
	}

	function getSlug(id) {
		Loading.show();
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'artists/slug/' + id
		}).success(function(data) {
			if (data.results.length) {
				for (var i = 0; i < data.results.length; i++) {
					if (data.results[i].slug === id) {
						Loading.hide();
						deferred.resolve(getInfo(data.results[i].id));
					}
				}
			}
			return;
		}).error(function() {
			deferred.reject();
		});
		return deferred.promise;
	}

	function getBio(slug) {
		var deferred = $q.defer();
		Loading.show();
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'artists/bio/' + slug
		}).success(function(data) {
			Loading.hide();
			deferred.resolve(data);
		}).error(function() {
			deferred.reject();
		});
		return deferred.promise;
	}
	function getRelated(slug) {
		var deferred = $q.defer();
		Loading.show();
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'artists/related/' + slug
		}).success(function(data) {
			Loading.hide();
			deferred.resolve(data);
		}).error(function() {
			deferred.reject();
		});
		return deferred.promise;
	}
	var service = {
		getInfo: getInfo,
		getSlug: getSlug,
		getBio: getBio,
		getRelated: getRelated
	};

	return service;
}

angular.module('arcanine.services').factory('ArtistService', ArtistService);