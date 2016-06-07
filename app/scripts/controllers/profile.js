'use strict';

function ProfileCtrl(profileUser) {
	var vm = this;
	vm.user = profileUser;
	
}

angular.module('arcanine.controllers').controller('ProfileCtrl', ProfileCtrl);