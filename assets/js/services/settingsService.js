var module = angular.module('settingsServiceModule', ['ngSails', 'angularModalService']);

function SettingsService($sails, $rootScope, modalService) {
	var self = this;
	
	this.load = function() {
		$sails.get('/settings').then(function(res) {
			self.settings = res.data;
			$rootScope.$broadcast('settingsLoaded', self.settings);
		}).catch(function(err) {
			console.log(err);
			alert('Chyba pri čítaní nastavení. Obnovte stránku.');
		})
	}
	
	this.save = function() {
		return $sails.put('/settings', self.settings);
	}
	
	this.openSettings = function() {
		modalService.showModal({
			templateUrl : 'settings/template',
			controller : 'SettingsController',
		}).then(function(modal) {
			modal.element.modal();
		}).catch(function(err) {
			console.log(err);
		});
	}
	
	return self;
}

module.factory('settingsService', ['$sails', '$rootScope', 'ModalService', SettingsService]);