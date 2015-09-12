var module = angular.module('settingsControllerModule', ['settingsServiceModule']);

module.controller('SettingsController', [ '$scope', 'settingsService', 'close', SettingsController]);

function SettingsController($scope, settingsService, close) {
	var self = this;
	
	$scope.settings = angular.extend({}, settingsService.settings);
	
	$scope.save = function() {		
		settingsService.save().catch(function(err) {
			alert('Chyba pri ukladaní nastavení.');
		});
	}
	
	$scope.close = function(result) {
		if (result === 'OK') {
			angular.extend(settingsService.settings, $scope.settings);
			$scope.save();
		}
		close(result, 500);
	}
}