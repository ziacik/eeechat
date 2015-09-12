var module = angular.module('settingsServiceModule', ['ngSails']);

function SettingsService($sails, $rootScope) {
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
	
	return self;
}

module.factory('settingsService', ['$sails', '$rootScope', SettingsService]);