module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-postcss');

	require('grunt-dojo2').initConfig(grunt, {
		stylus: {
			dev: {
				options: {
					'include css': true
				},
				files: [ {
					expand: true,
					src: 'src/**/*.styl',
					ext: '.css'
				} ]
			},
			dist: {
				options: {
					relativeDest: '/dist/umd'
				},
				files: [ {
					expand: true,
					src: 'src/**/*.styl',
					ext: '.css'
				}]
			}
		}
		// postcss: {
		// 	options: {
		// 		map: true,
		// 		processors: [
		// 			require('postcss-modules')
		// 		]
		// 	},
		// 	dev: {
		// 		files: [ {
		// 			expand: true,
		// 			flatten: true,
		// 			src: 'src/**/*.css',
		// 			ext: '.css',
		// 			dest: 'src/themes/structural/_generated/'
		// 		} ]
		// 	}
		// }
	});

	grunt.registerTask('dev', [
		'clean:typings',
		'typings:dev',
		'tslint',
		'clean:dev',
		'ts:dev',
		'stylus:dev',
		'copy:staticTestFiles'
	]);

	grunt.registerTask('dist', [
		'clean:typings',
		'typings:dist',
		'tslint',
		'clean:dist',
		'copy:staticDefinitionFiles',
		'ts:dist',
		'stylus:dist',
		'fixSourceMaps'
	]);
};


// // var path = require('path');
// // var fs = require('fs');

// module.exports = function (grunt) {
// 	grunt.loadNpmTasks('grunt-contrib-stylus');
// 	grunt.loadNpmTasks('grunt-postcss');

// 	var staticExampleFiles = [ 'src/examples/**', '!src/examples/**/*.js' ];

// 	require('grunt-dojo2').initConfig(grunt, {
// 		copy: {
// 			staticExampleFiles: {
// 				expand: true,
// 				cwd: '.',
// 				src: staticExampleFiles,
// 				dest: '<%= devDirectory %>'
// 			}
// 		},
// 		dtsGenerator: {
// 			options: {
// 				main: 'dojo-widgets/main'
// 			}
// 		},
// 		stylus: {
// 			dev: {
// 				options: {
// 					'include css': true
// 				},
// 				files: [ {
// 					expand: true,
// 					src: 'src/themes/**/*.styl',
// 					ext: '.css',
// 					dest: '_build/'
// 				} ]
// 			},
// 			dist: {
// 				options: {},
// 				files: [ {
// 					expand: true,
// 					cwd: 'src/',
// 					src: 'themes/**/*.styl',
// 					ext: '.css',
// 					dest: 'dist/'
// 				}]
// 			}
// 		},


// 	});


// };
