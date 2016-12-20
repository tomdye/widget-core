module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-postcss');

	require('grunt-dojo2').initConfig(grunt, {
		stylus: {
			dist: {
				files: [ {
					expand: true,
					src: '**/*.styl',
					cwd: 'src',
					ext: '.module.css',
					dest: 'dist/umd/'
				}]
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
					expand: true,
					src: 'dist/umd/**/*.css',
					ext: '.module.css'
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
		'stylus:dist',
		'postcss:dist',
		'fixSourceMaps'
	]);
};
