var module = angular.module('chatControllerModule', ['chatServiceModule', 'ngDialog']);

module.controller('ChatController', [ '$scope', 'ngDialog', 'chatService', ChatController]);

function ChatController($scope, ngDialog, chatService) {
	var self = this;
	$scope.connected = true;
	$scope.ready = false;
	$scope.settings = "sdfsd";

	self.chatReady = false;
	self.usersReady = false;
	self.messagesReady = false;
	
	$scope.$on('connectionUpdated', function() {
		$scope.connected = chatService.connected;
	});
	
	$scope.connect = function() {
		chatService.connect();
	};

	$scope.$on('chatReady', function() {
		self.chatReady = true;
		$scope.settings = chatService.settings;
		$scope.ready = self.chatReady && self.usersReady && self.messagesReady;
	});

	$scope.$on('connectedUsersUpdated', function() {
		self.usersReady = true;
		$scope.ready = self.chatReady && self.usersReady && self.messagesReady;
	});
	
	$scope.$on('messagesUpdated', function() {
		self.messagesReady = true;
		$scope.ready = self.chatReady && self.usersReady && self.messagesReady;
	});
}