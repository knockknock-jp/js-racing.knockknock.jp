module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cssmin: {
			combine: {
				files: {
					'css/imjcart.min.css': ['css/*.css']
				}
			}
		},
		concat: {
			dist: {
				src: ['js/imjcart/**/*.js'],
				dest: 'js/imjcart.js'
			}
		},
		watch: {
			files: ['css/**/*.css','js/imjcart/**/*.js'],
			tasks: ['cssmin','concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
 	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['cssmin', 'concat', 'watch']);

}
