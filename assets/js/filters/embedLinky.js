var module = angular.module('embedLinkyModule', ['ngSanitize', 'settingsServiceModule']);

/**
*	Modified 'linky' filter from angular-sanitize.
*/

function EmbedLinky($sanitize, settingsService) {
	var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i, MAILTO_REGEXP = /^mailto:/i;

	return function(text) {
		if (!text) {
			return text;
		}
		
		var match;
		var raw = text;
		var html = [];
		var url;
		var i;
		while ((match = raw.match(LINKY_URL_REGEXP))) {
			// We can not end in these as they are sometimes found at the end of
			// the sentence
			url = match[0];
			// if we did not match ftp/http/www/mailto then assume mailto
			if (!match[2] && !match[4]) {
				url = (match[3] ? 'http://' : 'mailto:') + url;
			}
			i = match.index;
			addText(raw.substr(0, i));
			addLink(url, match[0].replace(MAILTO_REGEXP, ''));
			raw = raw.substring(i + match[0].length);
		}
		addText(raw);
		return $sanitize(html.join(''));

		function addText(text) {
			if (!text) {
				return;
			}
			html.push(text);
		}

		function addLink(url, text) {
			if (settingsService.settings.embedLinks) {
				html.push('<a class="embedly-card" data-card-key="2c09f72b301c40c5a608911fbb70baa3" data-card-type="article" ');
			} else {
				html.push('<a target="_blank" ');
			}
			html.push('href="', url.replace(/"/g, '&quot;'), '">');
			addText(text);
			html.push('</a>');
		}
	};
}

module.filter('embedLinky', ['$sanitize', 'settingsService', EmbedLinky]);