var module = angular.module('messageControllerModule', [ 'messageServiceModule', 'settingsServiceModule', 'notification' ]);

module.controller('MessageController', [ '$scope', '$filter', '$location', '$anchorScroll', '$timeout', '$notification', 'Upload', 'settingsService', 'messageService', MessageController ]);

function MessageController($scope, $filter, $location, $anchorScroll, $timeout, $notification, Upload, settingsService, messageService) {
	var self = this;

	$scope.text = '';
	$scope.messages = [];
	$scope.editingId = null;
	$scope.uploadedItems = [];

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
		var outgoingText = $scope.text;
		
		if ($scope.uploadedItems.length) {
			outgoingText += '\r\n\r\n' + 'http://localhost:1337/' + $scope.uploadedItems[0].fd;
			$scope.uploadedItems = [];
		}
	
		messageService.send($scope.editingId, outgoingText);
		$scope.text = '';
		$scope.editingId = null;
		self.setFocus();
		self.scrollDown();
	};

	$scope.edit = function(id) {
		var message = $filter('filter')($scope.messages, {
			id : id
		})[0];
		$scope.text = message.content;
		$scope.editingId = id;
		self.setFocus();
	};

	$scope.cancelEdit = function() {
		$scope.text = '';
		$scope.editingId = null;
	};
	
	$scope.upload = function (files) {
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
			  var file = files[i];
			  if (!file.$error) {
				Upload.upload({
					url: 'upload',
					data: {
					  username: $scope.username,
					  file: file  
					}
				}).then(function (resp) {
					$timeout(function() {
						resp.data.forEach(function(item) {
							$scope.uploadedItems.push(item);
						});
						$scope.log = 'file: ' +
						resp.config.data.file.name +
						', Response: ' + JSON.stringify(resp.data) +
						'\n' + $scope.log;
					});
				}, null, function (evt) {
					var progressPercentage = parseInt(100.0 *
							evt.loaded / evt.total);
					$scope.log = 'progress: ' + progressPercentage + 
						'% ' + evt.config.data.file.name + '\n' + 
					  $scope.log;
				});
			  }
			}
		}
	};
}