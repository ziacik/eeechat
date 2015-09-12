var module = angular.module('chatControllerModule', ['chatServiceModule', 'settingsServiceModule']);

module.controller('ChatController', [ '$scope', 'settingsService', 'chatService', ChatController]);

function ChatController($scope, settingsService, chatService) {
	var self = this;
	$scope.connected = true;
	$scope.ready = false;

	self.settingsReady = false;
	self.usersReady = false;
	self.messagesReady = false;
	
	$scope.connect = function() {
		chatService.connect();
	};
	
	$scope.openSettings = settingsService.openSettings;

	$scope.$on('connectionUpdated', function() {
		$scope.connected = chatService.connected;
	});
	
	$scope.$on('settingsLoaded', function(event, settings) {
		self.settingsReady = true;
		$scope.settings = settings;
		$scope.ready = self.settingsReady && self.usersReady && self.messagesReady;
	});

	$scope.$on('connectedUsersUpdated', function() {
		self.usersReady = true;
		$scope.ready = self.settingsReady && self.usersReady && self.messagesReady;
	});
	
	$scope.$on('messagesUpdated', function() {
		self.messagesReady = true;
		$scope.ready = self.settingsReady && self.usersReady && self.messagesReady;
	});
}