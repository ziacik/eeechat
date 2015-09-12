var module = angular.module('chatServiceModule', ['ngSails', 'userServiceModule', 'messageServiceModule', 'settingsServiceModule']);

function ChatService($sails, $rootScope, userService, messageService, settingsService) {
	var self = this;
	this.connected = false;	
	
	this.connect = function() {
		self.connected = true;
		settingsService.load();
		userService.subscribe();
		messageService.subscribe();
		$rootScope.$broadcast('connectionUpdated');
	}
	
	$sails.on('disconnect', function() {
		self.connected = false;
		$rootScope.$broadcast('connectionUpdated');
	});

	$sails.on('connect', function() {
		if (!self.connected) {
			self.connect();
		}
	})
	
	return self;
}

module.factory('chatService', ['$sails', '$rootScope', 'userService', 'messageService', 'settingsService', ChatService ]);