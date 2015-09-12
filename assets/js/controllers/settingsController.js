var module = angular.module('settingsControllerModule', ['settingsServiceModule']);

module.controller('SettingsController', [ '$scope', 'settingsService', 'close', SettingsController]);

function SettingsController($scope, settingsService, close) {
	var self = this;
	
	$scope.settings = settingsService.settings;
	
	$scope.save = function() {		
		settingsService.save().catch(function(err) {
			alert('Chyba pri ukladaní nastavení.');
		});
	}
	
	$scope.close = function(result) {
		$scope.save();		
		close(result, 500);
	}
}