(function(exports) {

  function synthesizeGestureEvents(type, listener, useCapture) {
    if (type.indexOf('gesture') === 0) {
      var handler = Gesture._gestureHandlers[type];
      if (handler) {
        handler(this);
      } else {
        console.error('Warning: no handler found for {{evt}}.'
                      .replace('{{evt}}', type));
      }
    }
  }

  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
  // doesn't actually affect anything. Special case for Firefox:
  if (navigator.userAgent.match(/Firefox/)) {
    // TODO: fix this for the general case.
    window._augmentAddEventListener(HTMLDivElement, synthesizeGestureEvents);
    window._augmentAddEventListener(HTMLCanvasElement, synthesizeGestureEvents);
  } else {
    window._augmentAddEventListener(HTMLElement, synthesizeGestureEvents);
  }

  exports.Gesture = exports.Gesture || {};
  exports.Gesture._gestureHandlers = exports.Gesture._gestureHandlers || {};

})(window);
