module.exports = function( grunt ) {
  grunt.initConfig({
    jshint: {
      options: {
        'undef': true,
        'unused': true,
        'browser': true,
        'globals': {
          'console': true,
          'Gesture': true
        }
      },
      all: ['js/*.js']
    },
    concat: {
      build: {
        dest: 'build/pointer.js',
        src: [
          //'js/bind-polyfill.js',
          'js/libs/modernizr-touch.js',
          'js/pointer.js',
          'js/gesture.js',
          'js/doubletap.js',
          'js/longpress.js',
          'js/scale.js'
        ]
      }
    },
    uglify: {
      build: {
        files: {
          'build/pointer.min.js': ['build/pointer.js']
        }
      }
    }
  });
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.registerTask( 'default', [ 'jshint', 'concat', 'uglify' ] );
}