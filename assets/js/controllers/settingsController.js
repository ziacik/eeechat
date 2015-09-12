var module = angular.module('settingsControllerModule', ['chatServiceModule']);

module.controller('SettingsController', [ '$scope', 'chatService', SettingsController]);

function SettingsController($scope, chatService) {
	$scope.settings = chatService.settings;
	
	$scope.save = function() {		
		chatService.saveSettings().catch(function(err) {
			alert('Chyba pri ukladaní nastavení.');
		});
		$scope.closeThisDialog();
	}
}