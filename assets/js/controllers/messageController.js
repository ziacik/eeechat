var module = angular.module('messageControllerModule', [ 'messageServiceModule' ]);

module.controller('MessageController', ['$scope', 'messageService', function($scope, messageService) {
	$scope.sending = false;
	$scope.text = '';
	$scope.messages = [];
	$scope.editingId = null;

	$scope.$on('messagesUpdated', function() {
		$scope.messages = messageService.messages;
	});
	
	$scope.$on('messageSent', function() {
		$scope.text = '';
		$scope.editingId = null;
		$scope.sending = false;		
	})

	$scope.$on('messageSendError', function() {
		$scope.sending = false;		
	})

	$scope.send = function() {
		$scope.sending = true;
		messageService.send($scope.editingId, $scope.text);
	};

	$scope.edit = function(id) {
		id = +id;
		//TODO $scope.text = findById(id).content;
		$scope.editingId = id;
	};
}] );