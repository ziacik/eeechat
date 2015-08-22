var module = angular.module('messageControllerModule', [ 'ngSails', 'userServiceModule' ]);

module.controller('MessageController', function($scope, $sails) {
	$scope.sending = false;
	$scope.text = '';
	$scope.messages = [];
	$scope.editingId = null;

	(function() {
		var today = new Date();
		today.setHours(0, 0, 0, 0);

		$sails.get('/messages', { createdAt : { '>' : today } }).then(function(resp) {
			$scope.messages = resp.data;
		}, function(resp) {
			alert(resp.status + ' - ' + resp.body); //TODO
		});

		// Watching for updates
		var messageHandler = $sails.on('message', function(item) {
			if (item.verb === 'created') {
				$scope.messages.push(item.data);
			} else if (item.verb === 'updated') {
				var message = findById(item.id);
				$.extend(message, item.data);
			}
		});

		// Stop watching for updates
		$scope.$on('$destroy', function() {
			$sails.off('message', messageHandler);
		});

	}());
	
	$scope.send = function() {
		$scope.sending = true;
		
		if ($scope.editingId) {
			$sails.put('/messages/' + $scope.editingId, {
				content : $scope.text
			}).then(function(resp) {
				$.extend(findById($scope.editingId), resp.body);
				$scope.text = '';
				$scope.editingId = null;
				$scope.sending = false;
			}).catch(function(err) {
				alert(err); //TODO
				$scope.sending = false;
			});
		} else {
			$sails.post('/messages', {
				content : $scope.text
			}).then(function(resp) {
				$scope.messages.push(resp.body);
				$scope.text = '';
				$scope.sending = false;
			}).catch(function(err) {
				alert(err);
				$scope.sending = false;
			});
		}		
	};
	
	var findById = function(id) {
		for (var i = 0; i < $scope.messages.length; i++) {
			if ($scope.messages[i].id === id) {
				return $scope.messages[i];
			}
		}
		
		throw new Error('Unable to find message by id ' + id);
	}
	
	$scope.edit = function(id) {
		id = +id;
		$scope.text = findById(id).content;
		$scope.editingId = id;
	};
});