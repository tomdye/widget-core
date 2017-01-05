module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-postcss');

	var path = require('path');
	var fs = require('fs');

	require('grunt-dojo2').initConfig(grunt, {
		postcss: {
			options: {
				map: true,
				processors: [
					require('postcss-modules')({
						generateScopedName: '[name]__[local]__[hash:base64:5]'
						// getJSON: function(cssFileName, json) {
						// 	var jsonFileName = cssFileName.replace(/.css$/, '.styl.json');

						// 	fs.writeFileSync(jsonFileName, JSON.stringify(json));
						// }
					})
				]
			},
			dist: {
				files: [ {
					expand: true,
					src: '**/*.m.css',
					dest: 'dist/umd/',
					ext: '.m.css'
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
		'postcss:dist',
		'fixSourceMaps'
	]);
};
