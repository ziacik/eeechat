/**
 * UploadController
 *
 * @description :: Server-side logic for managing Uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upload : function(req, res) {
		req.file('file').upload({},function (err, uploadedFiles) {
			if (err) {
				return res.negotiate(err);
			}
			
			async.mapSeries(uploadedFiles, function(uploadedFile, callback) {
				Upload.create(uploadedFile).then(function(upload) {
					callback(null, {
						id : upload.id,
						name : upload.filename
					});
				}).catch(function(err) {
					callback(err);
				}).done();
			}, function(err, uploadIds) {
				if (err) {
					return res.negotiate(err);
				} else {
					return res.json(uploadIds);
				}
			});
		});
	},
	
	serve : function(req, res) {
		var SkipperDisk = require('skipper-disk');
		var fileAdapter = SkipperDisk();
		var fileId = req.param('id');
		
		Upload.findOne(fileId).then(function(upload) {
			fileAdapter.read(upload.fd).on('error', function (err) {
				return res.serverError(err);
			}).pipe(res);		
		}).catch(function(err) {
			return res.negotiate(err);
		}).done();
	}
};
