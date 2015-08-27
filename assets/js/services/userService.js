var module = angular.module('userServiceModule', []);

function UserService($sails, $rootScope) {
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

		$sails.get('/users').then(function(res) {
			self.allUsers = res.data;
			self.connectedUsers = res.data;
			self.modelUpdater = $sails.$modelUpdater('user', self.allUsers);
			self.modelUpdater2 = $sails.$modelUpdater('user', self.connectedUsers);
			$rootScope.$broadcast("usersUpdated");			
		}).catch(function(err) {
			console.log(err);
			$rootScope.$broadcast("userSubscribeError");			
		})
	};

	this.defaultUser = {
		username : 'unknown',
		imageUrl : 'http://placehold.it/50/faf/?text=+'
	};

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
			userToReturn.imageUrl = 'http://placehold.it/50/faf/?text=' + userToReturn.username;
		}

		return userToReturn;
	};
}

module.factory('userService', ['$sails', '$rootScope', function($sails, $rootScope) {
	return new UserService($sails, $rootScope);
}]);