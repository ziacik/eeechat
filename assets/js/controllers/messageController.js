var module = angular.module('messageControllerModule', [ 'messageServiceModule', 'notification' ]);

module.controller('MessageController', ['$scope', '$filter', '$location', '$anchorScroll', '$timeout', '$notification', 'messageService', function($scope, $filter, $location, $anchorScroll, $timeout, $notification, messageService) {
	var self = this;
	
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
	
	$scope.$on('messageReceived', function(event, message) {
		self.scrollDown();	
	})

	$scope.$on('messagesUpdated', function() {
		$scope.messages = messageService.messages;
		self.scrollDown();
	});
	
	$scope.send = function() {
		messageService.send($scope.editingId, $scope.text);
		$scope.text = '';
		$scope.editingId = null;
		self.setFocus();
		self.scrollDown();	
	};

	$scope.edit = function(id) {
		id = +id;
		var message = $filter('filter')($scope.messages, { id : id })[0];
		$scope.text = message.content;
		$scope.editingId = id;
	};
}] );