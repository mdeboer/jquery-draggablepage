'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
		jshint: {
			src: 'jquery-draggablepage.js',
			options: {
				jshintrc: true
			}
		},
		uglify: {
			options: {
				sourceMap: true,
				mangle: true,
				compress: true,
				report: 'gzip'
			},
			dist: {
				files: [{
					'jquery-draggablepage.min.js': ['jquery-draggablepage.js'],
				}]
			}
		}
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify']);

};
