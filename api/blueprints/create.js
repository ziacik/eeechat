var originalCreate = require('sails/lib/hooks/blueprints/actions/create');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function createRecord(req, res) {
	var Model = actionUtil.parseModel(req);
	
	var resHack = {
		created : function(item) {
			Model.findOne({
				id : item.id
			}).populateAll().exec(function(err, populatedInstance) {
				if (err)
					return res.negotiate(err);

				res.created(populatedInstance);
			});
		}
	};

	originalCreate(req, resHack);
};
