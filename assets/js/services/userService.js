var module = angular.module('userServiceModule', [ 'appServiceModule' ]);

function UserService($sails, $rootScope, $filter, appService) {
	var self = this;
	
	this.myUserId;
	
	this.allUsers = [];
	this.connectedUsers;
	
	this.modelUpdater;

	this.subscribe = function() {
		if (this.modelUpdater) {
			this.modelUpdater();
			delete this.modelUpdater;
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
			self.mergeAllUsers(res.data);
			self.modelUpdater = $sails.$modelUpdater('user', self.allUsers);			
			return $sails.get('/users/online', {
				appId : appService.appId,
				room : appService.room
			})			
		}).then(function(res) {
			self.myUserId = res.data[0];
			self.myself = self.getById(self.myUserId);
			self.connectedUsers = res.data.map(function(userId) {
				return self.getById(userId);
			})
			$rootScope.$broadcast('connectedUsersUpdated');	
		}).catch(function(err) {
			console.log(err);
			$rootScope.$broadcast('userSubscribeError'); //TODO handle this
		})
	};

	this.stringToColor = function(str) {
		for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
		for (var i = 0, color = ""; i < 3; color += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
		return color;
	}
	
	this.mergeAllUsers = function(users) {
		users.forEach(function(user) {
			var existingUser = self.getById(user.id);
			
			if (existingUser) {
				angular.extend(existingUser, user);
			} else {
				this.allUsers.push(user);
			}
		});
	}

	this.getById = function(userId, dontAddIfNotFound) {
		var userToReturn;

		for (var i = 0; i < this.allUsers.length; i++) {
			if (this.allUsers[i].id === userId) {
				userToReturn = this.allUsers[i];
				break;
			}
		}
		
		if (!userToReturn && dontAddIfNotFound) {
			return;
		}
		
		if (!userToReturn) {
			userToReturn = this.addDefaultUser(userId);
		}

		if (!userToReturn.imageUrl) {
			userToReturn.imageUrl = 'http://placehold.it/50/' + this.stringToColor(userToReturn.username) + '/?text=' + userToReturn.username;
		}

		return userToReturn;
	};
	
	this.addDefaultUser = function(userId) {
		var userToReturn = {
			id : userId,
			username : 'Neznámy',
			imageUrl : 'http://placehold.it/50/faf/?text=+'
		};
		
		this.allUsers.push(userToReturn);
		return userToReturn;
	}
	
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
	
	this.updateMyName = function(newName) {
		return $sails.put('/users/' + self.myUserId, {
			username : newName
		}).then(function(data) {
			self.myself.username = newName;
		})
	}
	
	return this;
}

module.factory('userService', [ '$sails', '$rootScope', '$filter', 'appService', UserService ]);