var module = angular.module('settingsControllerModule', ['settingsServiceModule']);

module.controller('SettingsController', [ '$scope', 'settingsService', SettingsController]);

function SettingsController($scope, settingsService) {
	$scope.settings = settingsService.settings;
	
	$scope.save = function() {		
		settingsService.save().catch(function(err) {
			alert('Chyba pri ukladaní nastavení.');
		});
		$scope.closeThisDialog();
	}
}