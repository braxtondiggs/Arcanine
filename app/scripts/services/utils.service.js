'use strict';

function UtilsService() {
	function checkImage(img) {
		return (img.slice(-3) === 'jpg') ? ((img.indexOf('http://imvdb.com/') > -1) ? img.substr(17) : img) : 'images/logo_missing.png';
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

	var service = {
		checkImage: checkImage,
		convertSlug: convertSlug
	};

	return service;
}

angular.module('arcanine.services').factory('Utils', UtilsService);