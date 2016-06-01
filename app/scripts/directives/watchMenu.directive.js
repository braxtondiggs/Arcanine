'use strict';

var watchMenu = function($timeout, $ionicSideMenuDelegate) {
	function link(scope) {
		$timeout(function() {
			scope.$watch(function() {
				return $ionicSideMenuDelegate.getOpenRatio();
			}, function(ratio) {
				scope.data = ratio;
				scope.ratio = (ratio >= 0.5);
			});
		});

	}
	var directive = {
		link: link,
		restrict: 'A'
	};

	return directive;
};

angular.module('arcanine.directives').directive('watchMenu', watchMenu);