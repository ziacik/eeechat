var module = angular.module('messageControllerModule', [ 'messageServiceModule', 'userServiceModule', 'notification' ]);

module.controller('MessageController', ['$scope', '$filter', '$location', '$anchorScroll', '$timeout', '$notification', 'userService', 'messageService', function($scope, $filter, $location, $anchorScroll, $timeout, $notification, userService, messageService) {
	var self = this;
	
	$scope.ready = false;
	$scope.text = '';
	$scope.messages = [];
	$scope.editingId = null;
	
	this.autoScroll = true;
	this.usersReady = false;
	this.messagesReady = false;
	
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
	
	this.notify = function(message) {
		var sender = userService.getById(message.sender);
		
		$notification(sender.username, {
			body : message.content,
			delay : 3000,
			icon : sender.imageUrl
		});
	};
	
	$scope.$on('connectedUsersUpdated', function() {
		this.usersReady = true;
		$scope.ready = this.usersReady && this.messagesReady;
	});	
	
	$scope.$on('messageReceived', function(event, message) {
		self.scrollDown();	
		self.notify(message);
	})

	$scope.$on('messagesUpdated', function() {
		$scope.messages = messageService.messages;
		self.scrollDown();
		this.messagesReady = true;
		$scope.ready = this.usersReady && this.messagesReady;		
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