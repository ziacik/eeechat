var module = angular.module('userControllerModule', ['userServiceModule']);

module.controller('UserController', UserController);

function UserController($scope, userService) {
	$scope.users = [];
	
	userService.getConnected().then(function(users) {
		$scope.users = users;
	}).catch(function(err) {
		alert(err);
	});
	
	$scope.getById = function(userId) {
		return userService.getById(userId);
	};
}
