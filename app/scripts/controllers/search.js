'use strict';

function SearchCtrl($scope, $http, $localStorage, $timeout, lodash, $cordovaKeyboard, $ionicTabsDelegate, Loading, ENV, Utils, Queue) {
	var vm = this;
	vm.term = '';
	vm.changed = false;
	vm.action = ($ionicTabsDelegate.selectedIndex() === 0) ? 'videos' : 'entities';
	vm.$storage = $localStorage.$default({
		'search': {
			videos: [],
			entities: []
		}
	});

	function getPage() {
		return (vm[vm.action] && vm[vm.action].current_page > 0) ? parseInt(vm[vm.action].current_page, 10) + 1 : 1;
	}

	function history() {
		var index = vm.$storage.search[vm.action].indexOf(vm.term);
		if (index === -1) {
			vm.$storage.search[vm.action].unshift(vm.term);
			if (vm.$storage.search[vm.action].length >= 5) {
				vm.$storage.search[vm.action] = vm.$storage.search[vm.action].slice(0, 5);
			}
		} else {
			vm.$storage.search[vm.action] = ionic.Utils.arrayMove(vm.$storage.search[vm.action], 0, index);
		}
	}

	function search(num) {
		Loading.show();
		$http({
			method: 'GET',
			url: ENV.apiEndpoint + 'search',
			params: {
				pg: num,
				q: vm.term,
				s: vm.action
			}
		}).success(function(data) {
			if (num > 1) {
				lodash.merge(vm[vm.action], data, function(a, b) {
					if (lodash.isArray(a)) {
						return a.concat(b);
					}
				});
				vm[vm.action].current_page = data.current_page;
				vm[vm.action].loaded = true;
			} else {
				vm[vm.action] = {
					results: data.results,
					current_page: data.current_page,
					total_pages: data.total_pages,
					loaded: true,
					maxed: false
				};
				if ($ionicTabsDelegate.selectedIndex() === 1) {
					vm[vm.action].resultsTop = lodash.filter(data.results, function(item) {
						return vm.convertSlug(item.name, item.slug).toString().toLowerCase().indexOf(vm.term.toLowerCase()) > -1;
					});
					vm[vm.action].results = lodash.filter(data.results, function(item) {
						return vm.convertSlug(item.name, item.slug).toString().toLowerCase().indexOf(vm.term.toLowerCase()) === -1;
					});
					if (lodash.isEmpty(vm[vm.action].resultsTop)) {
						delete vm[vm.action].resultsTop;
					}
				}
			}
			history();
			Loading.hide();
		});
	}
	$scope.$watch(angular.bind(this, function() {
		return this.term;
	}), function(term) {
		if (term && term.length > 2) {
			vm.changed = true;
			search(1);
		}
	});
	vm.set = function(term) {
		vm.term = term;
	};
	vm.load = function() {
		if (parseInt(vm[vm.action].current_page, 10) !== parseInt(vm[vm.action].total_pages, 10)) {
			search(getPage());
		} else {
			vm[vm.action].maxed = true;
		}
		$timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, 500);
	};
	vm.onChange = function(action) {
		vm.action = action;
		if (vm.changed) {
			search(getPage());
			vm.changed = false;
		}
	};
	vm.select = function(track) {
		Queue.add(track);
	};
	vm.checkImage = function(img) {
		return Utils.checkImage(img);
	};
	vm.convertSlug = function(name, slug) {
		return Utils.convertSlug(name, slug);
	};
	vm.getKeys = function($event) {
		if ($event.which === 13) {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				if ($cordovaKeyboard.isVisible()) {
					$cordovaKeyboard.close();
				}
			}
		}
	};
}

angular.module('arcanine.controllers').controller('SearchCtrl', SearchCtrl);