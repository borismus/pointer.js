module.exports = function(grunt) {
  grunt.initConfig({
    lint: { all: ['js/*.js'] },
    concat: { 'build/pointer.js': [
      //'js/bind-polyfill.js',
      'js/libs/modernizr-touch.js',
      'js/pointer.js',
      'js/gesture.js',
      'js/doubletap.js',
      'js/longpress.js',
      'js/scale.js']
    },
    min: { 'build/pointer.min.js': ['build/pointer.js'] },
  });

  grunt.registerTask('default', 'lint concat min');
};
