var module = angular.module('settingsServiceModule', ['sails.io', 'angularModalService']);

function SettingsService($sailsSocket, $rootScope, modalService) {
	var self = this;
	var $sails = $sailsSocket;

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
		return $sailsSocket.put('/settings', self.settings);
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

module.factory('settingsService', ['$sailsSocket', '$rootScope', 'ModalService', SettingsService]);