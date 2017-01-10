module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-postcss');

	var path = require('path');
	var fs = require('fs');

	require('grunt-dojo2').initConfig(grunt, {
		postcss: {
			options: {
				map: true,
				processors: [
					require('postcss-import'),
					require('postcss-cssnext')({
						features: {
							customProperties: {
								preserve: 'computed'
							},
							autoprefixer: {
								browsers: [
									'last 2 versions',
									'ie >= 10'
								]
							}
						}
					}),
					require('postcss-modules')({
						generateScopedName: '[name]__[local]__[hash:base64:5]',
						getJSON: function(cssFileName, json) {
							var outputPath = path.resolve(grunt.config.data.distDirectory, path.relative('src', cssFileName))
							fs.writeFileSync(outputPath + '.json', JSON.stringify(json));
						}
					})
				]
			},
			dist: {
				files: [ {
					expand: true,
					src: '**/*.css',
					dest: '<%= distDirectory %>',
					cwd: 'src'
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
