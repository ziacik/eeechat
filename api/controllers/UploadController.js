/**
 * UploadController
 *
 * @description :: Server-side logic for managing Uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upload : function(req, res) {
		req.file('file').upload({
			dirname: './assets/uploads'
		},function (err, uploadedFiles) {
			if (err) {
				return res.negotiate(err);
			}
			
			return res.json(uploadedFiles);
		});
	},
	
	serve : function(req, res) {
		var SkipperDisk = require('skipper-disk');
		var fileAdapter = SkipperDisk();
		var fileId = req.param('id');

		fileAdapter.read(fileId).on('error', function (err) {
			return res.serverError(err);
		}).pipe(res);
	}
};
