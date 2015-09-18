var module = angular.module('messageServiceModule', ['userServiceModule', 'notificationServiceModule']);

function MessageService($sailsSocket, $rootScope, $timeout, $window, userService, notificationService) {
	var self = this;
	var $sails = $sailsSocket;
	
	this.messages;
	this.modelUpdater;
	
	this.subscribe = function() {
		if (this.modelUpdater) {
			this.modelUpdater();
			delete this.modelUpdater;
		}
		
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		
		$sails.get('/messages', { createdAt : { '>' : today } }).then(function(res) {
			self.messages = res.data;
			self.messages.forEach(function(message) {
				message.senderUser = userService.getById(message.sender);
			})
			//self.modelUpdater = $sails.$modelUpdater('message', self.messages);
			$rootScope.$broadcast("messagesUpdated");
		}).catch(function(err) {
			console.log(err);
			$rootScope.$broadcast("messageSubscribeError");	
		})
	};
	
	$sails.subscribe('message', function(message) {
		switch (message.verb) {
		case "created":
			self.messages.push(message.data);
			message.data.senderUser = userService.getById(message.data.sender);
			$rootScope.$broadcast("messageReceived", message.data);
			notificationService.notify(message.data);
			break;

		case "updated":
			var obj = self.findById(message.id);

			if (!obj && !message.previous) return;

			if (!obj) {
				// sails has given us the previous record, create it in our model
				obj = message.previous;
				self.messages.push(obj);
			}

			// update the model item
			angular.extend(obj, message.data);
			break;
		}
	});

	this.findById = function(messageId) {
		if (!this.messages) {
			return;
		}
		
		for (i = 0; i < this.messages.length; i++) {
			if (this.messages[i].id === messageId) {
				return this.messages[i];
			}
		}		
	}
	
	this.addSending = function(content) {
		var newMessage = {
			sender : userService.myUserId,
			senderUser : userService.myself,
			content : content,
			state : 'sending'
		};
		this.messages.push(newMessage)
		return newMessage;
	};
	
	this.setSending = function(messageId, content) {
		var message = self.findById(messageId);
		message.content = content;
		message.state = 'sending';
		return message;
	};
	
	this.setFailure = function(message) {
		message.state = 'failed';		
	}
	
	this.setSuccess = function(message) {
		delete message.state;		
	};
	
	this.successFunc = function(message) {
		return function(resp) {
			angular.extend(message, resp.body);
			self.setSuccess(message);
		};
	};
	
	this.errorFunc = function(message) {
		return function(err) {
			console.log(err);
			self.setFailure(message);
		}
	}
	
	this.send = function(messageId, content) {
		if (messageId) {
			var message = self.setSending(messageId, content);
			
			$sails.put('/messages/' + messageId, {
				content : content
			})
			.then(self.successFunc(message))
			.catch(self.errorFunc(message));
		} else {
			var message = self.addSending(content);
			
			$sails.post('/messages', {
				content : content
			})
			.then(self.successFunc(message))
			.catch(self.errorFunc(message));
		}
	}
	
	return self;
}

module.factory('messageService', ['$sailsSocket', '$rootScope', '$timeout', '$window', 'userService', 'notificationService', MessageService ]);