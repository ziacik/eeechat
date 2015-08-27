var module = angular.module('userControllerModule', ['userServiceModule']);

module.controller('UserController', [ '$scope', 'userService', UserController]);

function UserController($scope, userService) {
	$scope.users = [];

	$scope.getById = function(userId) {
		return userService.getById(userId);
	};
	
	$scope.$on('usersUpdated', function() {
		$scope.users = userService.connectedUsers;
	});
}