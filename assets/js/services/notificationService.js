var module = angular.module('notificationServiceModule', ['notification']);

function NotificationService($timeout, $window, $notification) {
	var self = this;

	this.titleChanged = false;
	this.titleNotification;
	this.isFocused = true;
	
	this.settings = {
		showAvatars : true,
		showDesktopNotifications : true,
		showTitleNotifications : true,
		desktopNotificationInterval : 6,
		titleNotificationInterval : 2
	};

	angular.element($window).bind('focus', function () {
		self.stopTitleNotifyBlink();
		self.isFocused = true;
	});
	
	angular.element($window).bind('blur', function () {
		self.isFocused = false;
	});	
	
	this.systemNotify = function(info) {
		if (self.settings.showDesktopNotifications) {
			console.log({
				body : info,
				delay : self.settings.desktopNotificationInterval * 1000,
				icon : 'images/app32.png'
			})
			$notification('Upozornenie', {
				body : info,
				delay : self.settings.desktopNotificationInterval * 1000,
				icon : 'images/app32.png'
			});
		}

		if (this.isFocused) {
			return;
		}
				
		if (self.settings.showTitleNotifications) {
			this.stopTitleNotifyBlink();
			this.titleNotifyBlink('Upozornenie', info);
		}		
	}

	this.notify = function(message) {
		if (this.isFocused) {
			return;
		}
		
		if (self.settings.showDesktopNotifications) {
			$notification(message.senderUser.username, {
				body : message.content,
				delay : self.settings.desktopNotificationInterval * 1000,
				icon : self.settings.showAvatars ? message.senderUser.imageUrl : null
			});
		}
		
		if (self.settings.showTitleNotifications) {
			this.startTitleNotifyBlink(message);
		}
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
		this.titleNotifyBlink(message.senderUser.username, message.content.substr(0, 20) + '...');
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
		}, self.settings.titleNotificationInterval * 1000);
	};
	
	return self;
}

module.factory('notificationService', ['$timeout', '$window', '$notification', NotificationService ]);