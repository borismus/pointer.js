(function(exports) {

  var oldAddEventListener = HTMLElement.prototype.addEventListener;
  HTMLElement.prototype.addEventListener = function(type, listener, useCapture) {
    if (type.indexOf('gesture') === 0) {
      var handler = Gesture._gestureHandlers[type];
      if (handler) {
        handler(this);
      } else {
        console.error('Warning: no handler found for {{evt}}.'
                      .replace('{{evt}}', type));
      }
    }
    oldAddEventListener.call(this, type, listener, useCapture);
  };

  exports.Gesture = exports.Gesture || {};
  exports.Gesture._gestureHandlers = exports.Gesture._gestureHandlers || {};

})(window);
