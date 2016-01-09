var module = angular.module('chatServiceModule', ['ngSails', 'appServiceModule', 'userServiceModule', 'messageServiceModule', 'settingsServiceModule', 'appServiceModule', 'notificationServiceModule']);

function ChatService($sails, $rootScope, appService, userService, messageService, settingsService, appService, notificationService) {
	var self = this;
	this.connected = false;
	
	this.init = function() {
		appService.load().then(self.connect);
		self.bindEvents();
	};
	
	this.connect = function() {
		self.join();
		settingsService.load();
		userService.subscribe();
		messageService.subscribe();
	};
	
	this.disconnect = function(locationQuery) {
		appService.disconnect(locationQuery);
	};
	
	this.join = function() {
		var query = {
			appId : appService.appId,
			room : appService.room
		};
		
		$sails.get('/chat/join', query).then(function() {
			self.connected = true;
			$rootScope.$broadcast('connectionUpdated');
		}).catch(function(err) {
			appService.checkError(err);
		});
	}
	
	this.bindEvents = function() {
		$sails.on('disconnect', function() {
			self.connected = false;
			$rootScope.$broadcast('connectionUpdated');
		});
	
		$sails.on('connect', function() {
			if (!self.connected && appService.loaded) {
				self.connect();
			}
		});
	};
	
	return self;
}

module.factory('chatService', ['$sails', '$rootScope', 'appService', 'userService', 'messageService', 'settingsService', 'appService', 'notificationService', ChatService ]);