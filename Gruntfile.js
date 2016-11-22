module.exports = function(grunt) {
  grunt.initConfig({
    jshint: { all: ['js/*.js'] },
    concat: { 'build/pointer.js': [
      //'js/bind-polyfill.js',
      'js/libs/modernizr-touch.js',
      'js/pointer.js',
      'js/gesture.js',
      'js/doubletap.js',
      'js/longpress.js',
      'js/scale.js']
    },
    uglify: { 'build/pointer.min.js': ['build/pointer.js'] }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
