var module = angular.module('settingsServiceModule', ['ngSails', 'angularModalService', 'notificationServiceModule', 'appServiceModule']);

function SettingsService($sails, $rootScope, modalService, notificationService, appService) {
	var self = this;
	
	this.load = function() {
		$sails.get('/settings').then(function(res) {
			self.settings = res.data;
			notificationService.settings = self.settings;
			$rootScope.$broadcast('settingsLoaded', self.settings);
		}).catch(function(err) {
			appService.checkError(err);
		})
	}
	
	this.save = function() {
		notificationService.settings = self.settings;
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

module.factory('settingsService', ['$sails', '$rootScope', 'ModalService', 'notificationService', 'appService', SettingsService]);