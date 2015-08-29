var module = angular.module('chatServiceModule', ['ngSails', 'userServiceModule', 'messageServiceModule']);

function ChatService($sails, $rootScope, userService, messageService) {
	var self = this;
	this.connected = true;
	
	this.run = function() {
		userService.subscribe();
		messageService.subscribe();
	};
	
	$sails.on('disconnect', function() {
		self.connected = false;
		$rootScope.$broadcast('connectionUpdated');
	});

	$sails.on('connect', function() {
		userService.subscribe();
		messageService.subscribe();
		self.connected = true;
		$rootScope.$broadcast('connectionUpdated');
	})
}

module.factory('chatService', ['$sails', '$rootScope', 'userService', 'messageService', function($sails, $rootScope, userService, messageService) {
	return new ChatService($sails, $rootScope, userService, messageService);
}]);