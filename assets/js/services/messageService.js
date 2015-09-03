var module = angular.module('messageServiceModule', ['userServiceModule']);

function MessageService($sails, $rootScope, userService) {
	var self = this;
	
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
			self.modelUpdater = $sails.$modelUpdater('message', self.messages);
			$rootScope.$broadcast("messagesUpdated");			
		}).catch(function(err) {
			console.log(err);
			$rootScope.$broadcast("messageSubscribeError");			
		})
	};
	
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
}

module.factory('messageService', ['$sails', '$rootScope', 'userService', function($sails, $rootScope, userService) {
	return new MessageService($sails, $rootScope, userService);
}]);