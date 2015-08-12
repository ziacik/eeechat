var app = angular.module("eeechat", [ 'ngSails' ]);

app.controller("MessageController", function($scope, $sails) {
	$scope.messages = [];

	(function() {
		$sails.get("/message").then(function(resp) {
			$scope.messages = resp.data;
		}, function(resp) {
			alert(resp.status + ' - ' + resp.body);
		});

		// Watching for updates
		var messageHandler = $sails.on("message", function(message) {
			if (message.verb === "created") {
				$scope.messages.push(message.data);
			}
		});

		// Stop watching for updates
		$scope.$on('$destroy', function() {
			$sails.off('message', messageHandler);
		});

	}());
});