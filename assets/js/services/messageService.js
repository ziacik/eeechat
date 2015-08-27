var module = angular.module('messageServiceModule', []);

function MessageService($sails, $rootScope) {
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
	
	this.send = function(messageId, content) {
		if (messageId) {
			$sails.put('/messages/' + messageId, {
				content : content
			}).then(function(resp) {
				var message = self.findById(messageId);
		        angular.extend(message, resp.body);
		        $rootScope.$broadcast('messageSent');
			}).catch(function(err) {
				console.log(err);
		        $rootScope.$broadcast('messageSendError');
			});
		} else {
			$sails.post('/messages', {
				content : content
			}).then(function(resp) {
				self.messages.push(resp.body);
		        $rootScope.$broadcast('messageSent');
			}).catch(function(err) {
				console.log(err);
		        $rootScope.$broadcast('messageSendError');
			});
		}
	}
}

module.factory('messageService', ['$sails', '$rootScope', function($sails, $rootScope) {
	return new MessageService($sails, $rootScope);
}]);