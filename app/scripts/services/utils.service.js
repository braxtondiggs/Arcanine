'use strict';

function UtilsService() {
	function checkImage(img) {
		return (img.slice(-3) === 'jpg') ? ((img.indexOf('https://imvdb.com/') > -1) ? img.substr(18) : img) : 'images/logo_missing.png';
	}

	function convertSlug(name, slug) {
		if (name !== null && name !== undefined && name !== '') {
			return name;
		} else if (slug !== null && slug !== undefined && slug !== '') {
			if (isNaN(slug)) {
				return slug.replace('-', ' ').replace('-', ' ').replace(/\w\S*/g, function(txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			} else {
				return slug;
			}
		} else {
			return '';
		}
	}

	function toSlug(artist) {
		return artist.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
	}

	function unitConvert(unit, m) {
		var KM_TO_MILES = 0.621371;
		var MILES_TO_KM = 1.60934;
		return Math.round(((unit === 'mi') ? m * KM_TO_MILES : m * MILES_TO_KM) * 100) / 100;
	}

	var service = {
		checkImage: checkImage,
		convertSlug: convertSlug,
		toSlug: toSlug,
		unitConvert: unitConvert
	};

	return service;
}

angular.module('arcanine.services').factory('Utils', UtilsService);