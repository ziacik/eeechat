var module = angular.module('chatServiceModule', ['ngSails', 'userServiceModule', 'messageServiceModule']);

function ChatService($sails, $rootScope, userService, messageService) {
	var self = this;
	this.connected = false;
	
	this.connect = function() {
		self.connected = true;
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
}

module.factory('chatService', ['$sails', '$rootScope', 'userService', 'messageService', function($sails, $rootScope, userService, messageService) {
	return new ChatService($sails, $rootScope, userService, messageService);
}]);