module.exports = function( grunt ) {
  grunt.initConfig({
    jshint: {
      options: {
        'undef': true,
        'browser': true,
        'globals': {
          'console': true,
          'Gesture': true,
          'PointerTypes': true,
          'Modernizr': true
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
    },
    watch: {
      concat: {
        files: ['js/**/*.js'],
        tasks: 'concat'
      }
    }
  });
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask( 'default', [ 'jshint', 'concat', 'uglify' ] );
}