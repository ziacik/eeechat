'use strict';

angular
	.module('uploadServiceModule', [])
	.factory('uploadService', [ '$rootScope', '$timeout', '$location', 'Upload', UploadService ]);
	
function UploadService($rootScope, $timeout, $location, Upload) {
	var self = this;

	this.uploadItems = [];
	this.uploadErrors = [];
	
	this.uploadsUrl = $location.protocol() + '://' + $location.host() + ($location.port() !== 80 ? ":" + $location.port() : "") + "/upload?id=";

	this.upload = function (files) {
		if (!files || !files.length) {
			return;
		}
		
		var invalidFiles = files.filter(function(file) {
			return file.$error;
		});
		
		var validFiles = files.filter(function(file) {
			return !file.$error;
		});
		
		Array.prototype.push.apply(self.uploadErrors, invalidFiles);
		
		Upload.upload({
			url: 'upload',
			arrayKey : '',
			data: {
			  file: validFiles  
			}
		}).then(function(resp) {
			Array.prototype.push.apply(self.uploadItems, resp.data);
		}).catch(function(err) {
			self.uploadErrors.push({
				$err : err
			});
		}).finally(function() {
			$rootScope.$broadcast('uploadsUpdated');
		});
	};	
	
	this.removeUpload = function(id) {
		self.uploadItems = self.uploadItems.filter(function(item) {
			return item.id !== id;
		});
		$rootScope.$broadcast('uploadsUpdated');
	};
	
	this.clear = function() {
		self.uploadItems = [];
		self.uploadErrors = [];
		$rootScope.$broadcast('uploadsUpdated');
	};
	
	this.getUploadUrls = function() {
		return self.uploadItems.map(function(item) {
			return self.uploadsUrl + item.id;
		}).join('\n');
	};
	
	return self;
}
