/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */

var path = require('path');

module.exports = function(grunt) {

	grunt.config.set('bower', {
		install: {
			options: {
				targetDir: './assets/vendor',
				layout: function(type, component, source) {
					return path.dirname(source.replace('bower_components/', '').replace('/dist', ''));
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
