var module = angular.module('appServiceModule', []);

function AppService($sails, $rootScope, $location) {
	var self = this;
	
	this.appId = $location.search().appId;
	this.room = $location.search().room || 'global';
	
	this.load = function() {
		if (self.appId == null) {
			return $sails.get('/applications/?name=Eeechat').then(function(res) {
				self.appSettings = res.data[0];
				self.appId = self.appSettings.id; 
				$rootScope.$broadcast('appSettingsLoaded', self.appSettings);
			}).catch(function(err) {
				console.error(err);
				alert('Chyba pri čítaní nastavení. Obnovte stránku.');
			})
		} else {
			return $sails.get('/applications/' + self.appId).then(function(res) {
				self.appSettings = res.data;
				$rootScope.$broadcast('appSettingsLoaded', self.appSettings);
			}).catch(function(err) {
				console.error(err);
				alert('Chyba pri čítaní nastavení. Obnovte stránku.');
			})			
		}
	}
	
	return this;
}

module.factory('appService', ['$sails', '$rootScope', '$location', AppService ]);