var module = angular.module('settingsControllerModule', ['settingsServiceModule', 'userServiceModule']);

module.controller('SettingsController', [ '$scope', 'settingsService', 'userService', 'close', SettingsController]);

function SettingsController($scope, settingsService, userService, close) {
	var self = this;
	
	$scope.settings = angular.extend({}, settingsService.settings);
	$scope.name = userService.myself.username;
	
	$scope.save = function() {		
		settingsService.save().catch(function(err) {
			console.log(err);
			alert('Chyba pri ukladaní nastavení.');
		});
		
		if ($scope.name !== userService.myself.username) {
			userService.updateMyName($scope.name).catch(function(err) {
				var realErr = err.error;
				if (realErr.error === 'E_VALIDATION' && realErr.invalidAttributes && realErr.invalidAttributes.username && realErr.invalidAttributes.username[0].rule === 'unique') {
					alert('Zadané meno je už registrované.');
				} else {
					console.log(err);
					alert('Chyba pri zmene mena.')					
				}
			})
		}
	}
	
	$scope.close = function(result) {
		if (result === 'OK') {
			angular.extend(settingsService.settings, $scope.settings);
			$scope.save();
		}
		close(result, 500);
	}
}