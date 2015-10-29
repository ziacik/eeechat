var module = angular.module('chatServiceModule', ['ngSails', 'appServiceModule', 'userServiceModule', 'messageServiceModule', 'settingsServiceModule', 'appServiceModule']);

function ChatService($sails, $rootScope, appService, userService, messageService, settingsService, appService) {
	var self = this;
	this.connected = false;
	
	this.init = function() {
		appService.load().then(self.connect);
		self.bindEvents();
	}
	
	this.connect = function() {
		self.join();
		settingsService.load();
		userService.subscribe();
		messageService.subscribe();
	}
	
	this.join = function() {
		var query = {
			app : appService.appId,
			room : appService.room
		};
		
		$sails.get('/chat/join', query).then(function() {
			self.connected = true;
			$rootScope.$broadcast('connectionUpdated');
		}).catch(function(err) {
			alert('Nemožno sa zúčastniť chatu pre chybu. Skúste obnoviť neskôr.') //TODO alert
		})
	}
	
	this.bindEvents = function() {
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
	
	return self;
}

module.factory('chatService', ['$sails', '$rootScope', 'appService', 'userService', 'messageService', 'settingsService', 'appService', ChatService ]);