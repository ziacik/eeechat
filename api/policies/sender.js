module.exports = function(req, res, next) {
	if (!req.user) {
		return res.forbidden();
	}
	
	if (req.body) {
		req.body.sender = req.user.id;
	} else if (req.params) {
		req.params.sender = req.user.id;
	} else {
		return res.forbidden();
	}
	
	return next(); 
};
