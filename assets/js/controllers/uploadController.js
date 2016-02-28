angular
	.module('uploadControllerModule', [ 'uploadServiceModule' ])
	.controller('UploadController', [ '$scope', 'uploadService', UploadController ]);

function UploadController($scope, uploadService) {
	var self = this;

	$scope.uploadItems = [];
	$scope.uploadErrors = [];
	
	$scope.$on('uploadsUpdated', function() {
		$scope.uploadItems = uploadService.uploadItems;
		$scope.uploadErrors = uploadService.uploadErrors;
	});

	$scope.upload = function (files) {
		uploadService.upload(files);
	};
	
	$scope.removeUpload = function(id) {
		uploadService.removeUpload(id);
	};
}