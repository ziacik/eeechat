var module = angular.module('userServiceModule', []);

module.factory('userService', function($sails, $q) {
	var allUsers;
	var connectedUsers;

	//TODO this ain't work
	var userHandler = $sails.on('user', function(item) {
		alert(item);
		if (item.verb === 'created') {
			console.log('adding user', item)
			allUsers.push(item);
			connectedUsers.push(item);
		} else if (item.verb === 'updated') {
			var user = findById(item.id);

			if (item.status === 'connected') {
				if (!user) {
					users.push(user);
				}
			} else {
				if (user) {
					removeById(item.id);
				}
			}
		}
	});
	
	// Stop watching for updates
	//TODO
	/*$scope.$on('$destroy', function() {
		$sails.off('user', userHandler);
	})*/;

	return {
		getConnected : function() {
			console.log('GETT')
			return $sails.get('/users').then(function(resp) {
				users = resp.data;
				connectedUsers = users;/*.filter(function(item) {
					return item.status === 'connected';
				});*/
				console.log('GOT', connectedUsers)
				return connectedUsers;
			});		
		},
		getById : function(userId) {
			for (var i = 0; i < users.length; i++) {
				if (users[i].id === userId) {
					return users[i];
				}
			}
			
			throw new Error('User ' + userId + ' not found.');
		}
	};
});