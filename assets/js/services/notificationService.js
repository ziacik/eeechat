var module = angular.module('notificationServiceModule', ['userServiceModule', 'notification']);

function NotificationService($timeout, $window, $notification, userService) {
	var self = this;

	this.titleChanged = false;
	this.titleNotification;
	this.isFocused = true;

	angular.element($window).bind('focus', function () {
		self.stopTitleNotifyBlink();
		self.isFocused = true;
	});
	
	angular.element($window).bind('blur', function () {
		self.isFocused = false;
	});	

	this.notify = function(message) {
		if (this.isFocused) {
			return;
		}
		
		var sender = userService.getById(message.sender);
		
		$notification(sender.username, {
			body : message.content,
			delay : 3000,
			icon : sender.imageUrl
		});
		
		this.startTitleNotifyBlink(message);
	};
	
	
	this.stopTitleNotifyBlink = function() {
		var currentTitleNotification = this.titleNotification;
		
		if (currentTitleNotification) {
			$timeout.cancel(currentTitleNotification);
			this.titleNotification = null;
		}
		
		this.titleChanged = false;
		$window.document.title = 'Eeechat';
	}
	
	this.startTitleNotifyBlink = function(message) {
		this.stopTitleNotifyBlink();

		var sender = userService.getById(message.sender);

		this.titleNotifyBlink(sender.username, message.content.substr(0, 20) + '...');
	}
	
	this.titleNotifyBlink = function(senderName, contentPart) {		
		if (this.titleChanged) {
			$window.document.title = 'Eeechat';
		} else {
			$window.document.title = senderName + ' : ' + contentPart;
		}
		
		this.titleChanged = !this.titleChanged;
		
		this.titleNotification = $timeout(function() {
			self.titleNotifyBlink(senderName, contentPart);
		}, 1000);
	};
}

module.factory('notificationService', ['$timeout', '$window', '$notification', 'userService', function($timeout, $window, $notification, userService) {
	return new NotificationService($timeout, $window, $notification, userService);
}]);