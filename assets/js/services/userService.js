var module = angular.module('userServiceModule', []);

function UserService($sails, $q) {
	this.allUsers;
	this.connectedUsers;
	
	this.usersPromise = $sails.get('/users').then(function(res) {
		return res.data;
	});
	
	var self = this;
		
	var userHandler = $sails.on('user', function(item) {
		if (item.verb === 'created') {
			self.addOrLeaveAll(item.data);
			self.addOrLeaveConnected(item.data);
		}
	});

	this.getConnected = function() {
		if (this.connectedUsers) {
			var promise = $q.defer();
			promise.resolve(self.connectedUsers);
			return promise;
		} else {
			return this.usersPromise.then(function(users) {
				self.allUsers = users;
				self.connectedUsers = users; //TODO
				return self.connectedUsers;
			});
		}
		
		return promise;
	};
	
	this.addOrLeaveAll = function(user) {
		for (var i = 0; i < this.allUsers.length; i++) {
			if (this.allUsers[i].id === user.id) {
				return;
			}
		}
		
		this.allUsers.push(user);
	}
	
	this.addOrLeaveConnected = function(user) {
		for (var i = 0; i < this.connectedUsers.length; i++) {
			if (this.connectedUsers[i].id === user.id) {
				return;
			}
		}
		
		this.connectedUsers.push(user);
	}
	
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

module.factory('userService', function($sails, $q) {

	// Stop watching for updates
	//TODO
	/*$scope.$on('$destroy', function() {
		$sails.off('user', userHandler);
	})*/;

	return new UserService($sails, $q);
});