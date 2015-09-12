var module = angular.module('chatControllerModule', ['chatServiceModule', 'ngDialog']);

module.controller('ChatController', [ '$scope', 'ngDialog', 'chatService', ChatController]);

function ChatController($scope, ngDialog, chatService) {
	var self = this;
	$scope.connected = true;
	$scope.ready = false;

	self.settingsReady = false;
	self.usersReady = false;
	self.messagesReady = false;
	
	$scope.connect = function() {
		chatService.connect();
	};

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