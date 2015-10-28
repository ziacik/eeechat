var module = angular.module('messageControllerModule', [ 'messageServiceModule', 'settingsServiceModule', 'notification' ]);

module.controller('MessageController', ['$scope', '$filter', '$location', '$anchorScroll', '$timeout', '$notification', 'settingsService', 'messageService', MessageController ]);

function MessageController($scope, $filter, $location, $anchorScroll, $timeout, $notification, settingsService, messageService) {
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
			$location.hash('');
		});
	};
	
	this.setFocus = function() {
		$timeout(function() {
			$scope.focus = true;
		});
	};
	
	$scope.$watch('ready', function(ready) {
		if (ready) {
			self.setFocus();
		}
	});
	
	$scope.$on('messageReceived', function(event, message) {
		self.scrollDown();	
	})

	$scope.$on('messagesUpdated', function() {
		$scope.messages = messageService.messages;
		self.scrollDown();
	});
	
	$scope.sendIfKeyPressed = function($event) {
		var pressed = false;
		
		switch (settingsService.settings.sendKey) {
		case 'Enter':
			pressed = $event.keyCode == 13 && !$event.ctrlKey && !$event.altKey && !$event.shiftKey;
			break;
		case 'Ctrl+Enter':
			pressed = $event.keyCode == 13 && $event.ctrlKey && !$event.altKey && !$event.shiftKey;
			break;
		case 'Alt+Enter':
			pressed = $event.keyCode == 13 && !$event.ctrlKey && $event.altKey && !$event.shiftKey;
			break;
		case 'Shift+Enter':
			pressed = $event.keyCode == 13 && !$event.ctrlKey && !$event.altKey && $event.shiftKey;
			break;
		case 'Alt+S':
			pressed = $event.keyCode == 83 && !$event.ctrlKey && $event.altKey && !$event.shiftKey;
			break;
		case 'Ctrl+S':
			pressed = $event.keyCode == 83 && $event.ctrlKey && !$event.altKey && !$event.shiftKey;
			break;		
		}

		if (pressed) {
			$event.preventDefault();
			$scope.send();
		}
	}
	
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
}