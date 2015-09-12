var module = angular.module('chatServiceModule', ['ngSails', 'userServiceModule', 'messageServiceModule']);

function ChatService($sails, $rootScope, userService, messageService) {
	var self = this;
	this.connected = false;	
	
	this.connect = function() {
		self.connected = true;
		self.prepareChat();
		userService.subscribe();
		messageService.subscribe();
		$rootScope.$broadcast('connectionUpdated');
	}
	
	this.prepareChat = function() {
		$sails.get('/settings').then(function(res) {
			self.settings = res.data;
			$rootScope.$broadcast('chatReady');
		}).catch(function(err) {
			console.log(err);
			alert('Chyba pri čítaní nastavení. Obnovte stránku.');
		})
	}
	
	this.saveSettings = function() {
		return $sails.put('/settings', self.settings);
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