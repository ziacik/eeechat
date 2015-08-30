var module = angular.module('userFiltersModule', ['userServiceModule']);

function UserNameFilter(userService) {
	return function(userId) {
		return userService.getById(userId).username;
	}
}

function UserImageFilter(userService) {
	return function(userId) {
		return userService.getById(userId).imageUrl;
	}
}

module.filter('userName', ['userService', UserNameFilter]);
module.filter('userImage', ['userService', UserImageFilter]);