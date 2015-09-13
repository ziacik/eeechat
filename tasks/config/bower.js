/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */

var path = require('path');
var localConfig;

try {
	localConfig = require('../../config/local');
} catch(e) {
}

module.exports = function(grunt) {

	grunt.config.set('bower', {
		install: {
			options: {
				targetDir: './assets/vendor',
				layout: function(type, component, source) {
					var newSource = source.replace(/bower_components[\\\/]/, '').replace(/[\\\/]dist/, '');
					newSource = newSource.replace(/bootstrap[\\\/]fonts/, '../fonts');
					
					var environment = localConfig ? localConfig.environment : null;
					
					if (!environment) {
						environment = process.env.NODE_ENV || 'development';
					}
					
					if (environment === 'production') {
						newSource = newSource.replace(/font-awesome[\\\\\\/]fonts/, '../fonts');
					}
					
					return path.dirname(newSource);					
				},
				install: true,
				verbose: false,
				cleanTargetDir: true,
				cleanBowerDir: false,
				bowerOptions: {}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
};
