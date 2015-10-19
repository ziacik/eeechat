var module = angular.module('chatServiceModule', ['ngSails', 'userServiceModule', 'messageServiceModule', 'settingsServiceModule', 'roomServiceModule']);

function ChatService($sails, $rootScope, userService, messageService, settingsService, roomService) {
	var self = this;
	this.connected = false;	
	
	this.connect = function() {
		self.join();
		settingsService.load();
		userService.subscribe();
		messageService.subscribe();
	}
	
	this.join = function() {
		var query = {
			namespace : roomService.namespace,
			room : roomService.room
		};
		
		$sails.get('/chat/join', query).then(function() {
			self.connected = true;
			$rootScope.$broadcast('connectionUpdated');
		}).catch(function(err) {
			alert('Nemožno sa zúčastniť chatu pre chybu. Skúste obnoviť neskôr.') //TODO alert
		})
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

module.factory('chatService', ['$sails', '$rootScope', 'userService', 'messageService', 'settingsService', 'roomService', ChatService ]);