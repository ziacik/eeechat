var module = angular.module('userServiceModule', []);

function UserService($sails, $rootScope, $filter) {
	var self = this;
	
	this.allUsers;
	this.connectedUsers;
	this.modelUpdater;
	this.modelUpdater2;

	this.subscribe = function() {
		if (this.modelUpdater) {
			this.modelUpdater();
			delete this.modelUpdater;
		}

		if (this.modelUpdater2) {
			this.modelUpdater2();
			delete this.modelUpdater2;
		}
		
		$sails.on('user', function(message) {
			if (message.verb === 'messaged') {
				if (message.data.state === 'online') {
					if (!self.isAlreadyConnected(message.id)) {
						self.connectedUsers.push(self.getById(message.id));
					}
				} else if (message.data.state === 'offline') {
					self.removeConnected(message.id);					
				} else {
					console.log('Unknown state ' + message.data.state);
				}
				$rootScope.$broadcast('connectedUsersUpdated');	
			}
		});
		
		return $sails.get('/users').then(function(res) {
			self.allUsers = res.data;
			self.modelUpdater = $sails.$modelUpdater('user', self.allUsers);			
			return $sails.get('/users/connected')			
		}).then(function(res) {
			self.connectedUsers = res.data.map(function(userId) {
				return self.getById(userId);
			})
			$rootScope.$broadcast('connectedUsersUpdated');	
		}).catch(function(err) {
			console.log(err);
			$rootScope.$broadcast('userSubscribeError'); //TODO handle this
		})
	};

	this.defaultUser = {
		username : 'unknown',
		imageUrl : 'http://placehold.it/50/faf/?text=+'
	};
	
	this.stringToColor = function(str) {
		for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
		for (var i = 0, color = ""; i < 3; color += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
		return color;
	}

	this.getById = function(userId) {
		var userToReturn = this.defaultUser;

		if (this.allUsers) {
			for (var i = 0; i < this.allUsers.length; i++) {
				if (this.allUsers[i].id === userId) {
					userToReturn = this.allUsers[i];
					break;
				}
			}
		}

		if (!userToReturn.imageUrl) {
			userToReturn.imageUrl = 'http://placehold.it/50/' + this.stringToColor(userToReturn.username) + '/?text=' + userToReturn.username;
		}

		return userToReturn;
	};
	
	this.removeConnected = function(userId) {
		if (this.connectedUsers) {
			for (var i = 0; i < this.connectedUsers.length; i++) {
				if (this.connectedUsers[i].id === userId) {
					this.connectedUsers.splice(i, 1);
					break;
				}
			}
		}		
	}
	
	this.isAlreadyConnected = function(userId) {
		return !!$filter('filter')(this.connectedUsers, { id : userId }).length;
	}
	
	return this;
}

module.factory('userService', [ '$sails', '$rootScope', '$filter', UserService ]);