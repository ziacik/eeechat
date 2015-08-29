var module = angular.module('chatControllerModule', ['chatServiceModule']);

module.controller('ChatController', [ '$scope', 'chatService', ChatController]);

function ChatController($scope, chatService) {
	$scope.connected = true;

	$scope.$on('connectionUpdated', function() {
		$scope.connected = chatService.connected;
	});
	
	$scope.run = function() {
		chatService.run();
	}
}