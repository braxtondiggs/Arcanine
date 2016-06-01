'use strict';

function errSrc() {
	function link(scope, element, attrs) {
		element.bind('error', function() {
			if (attrs.src !== attrs.errSrc) {
				attrs.$set('src', attrs.errSrc);
				attrs.$set('class', 'missingImage');
			}
		});
	}

	var directive = {
		link: link
	};

	return directive;
}

angular.module('arcanine.directives', []).directive('errSrc', errSrc);