var module = angular.module('chatServiceModule', ['sails.io', 'userServiceModule', 'messageServiceModule', 'settingsServiceModule']);

function ChatService($sailsSocket, $rootScope, userService, messageService, settingsService) {
	var self = this;

	var $sails = $sailsSocket;
	this.connected = false;	
	
	this.connect = function() {
		self.connected = true;
		settingsService.load();
		userService.subscribe();
		messageService.subscribe();
		$rootScope.$broadcast('connectionUpdated');
	}
	
	$sails.subscribe('disconnect', function() {
		self.connected = false;
		$rootScope.$broadcast('connectionUpdated');
	});

	$sails.subscribe('connect', function() {
		if (!self.connected) {
			self.connect();
		}
	})
	
	return self;
}

module.factory('chatService', ['$sailsSocket', '$rootScope', 'userService', 'messageService', 'settingsService', ChatService ]);