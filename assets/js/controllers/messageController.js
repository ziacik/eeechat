var module = angular.module('messageControllerModule', [ 'messageServiceModule' ]);

module.controller('MessageController', ['$scope', '$filter', '$location', '$anchorScroll', '$timeout', 'messageService', function($scope, $filter, $location, $anchorScroll, $timeout, messageService) {
	var self = this;
	
	$scope.sending = false;
	$scope.text = '';
	$scope.messages = [];
	$scope.editingId = null;
	
	this.autoScroll = true;
	
	$scope.setAutoScroll = function(value) {
		self.autoScroll = value;
	}
	
	this.scrollDown = function() {
		if (!self.autoScroll) {
			return;
		}

		$timeout(function() {
			$location.hash('bottom');
			$anchorScroll();
		});
	};
	
	this.setFocus = function() {
		$timeout(function() {
			$scope.focus = true;
		});
	};
	
	$scope.$watch('messages.length', function() {
		self.scrollDown();
	})

	$scope.$on('messagesUpdated', function() {
		$scope.messages = messageService.messages;
		self.scrollDown();
	});
	
	$scope.$on('messageSent', function() {
		$scope.text = '';
		$scope.editingId = null;
		$scope.sending = false;
		self.setFocus();
	})

	$scope.$on('messageSendError', function() {
		$scope.sending = false;		
		self.setFocus();
	})

	$scope.send = function() {
		$scope.sending = true;
		messageService.send($scope.editingId, $scope.text);
	};

	$scope.edit = function(id) {
		id = +id;
		var message = $filter('filter')($scope.messages, { id : id })[0];
		$scope.text = message.content;
		$scope.editingId = id;
	};
}] );