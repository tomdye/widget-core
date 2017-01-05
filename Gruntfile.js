module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-postcss');

	var path = require('path');
	var fs = require('fs');

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			cssFiles: {
				expand: true,
				cwd: 'src',
				src: [ '**/*.css' ],
				dest: '<%= distDirectory %>'
			}
		},
		postcss: {
			options: {
				map: true,
				processors: [
					require('postcss-modules')({
						generateScopedName: '[name]__[local]__[hash:base64:5]'
					})
				]
			},
			dist: {
				files: [ {
					src: 'src/**/*.css'
				} ]
			}
		}
	});

	grunt.registerTask('dist', [
		'clean:typings',
		'typings:dist',
		'tslint',
		'clean:dist',
		'copy:staticDefinitionFiles',
		'ts:dist',
		// 'copy:cssFiles',
		'postcss:dist',
		'fixSourceMaps'
	]);
};
