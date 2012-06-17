/**
 * Gesture recognizer for the `doubletap` gesture.
 *
 * Taps happen when an element is pressed and then released.
 */
(function(exports) {
  var DOUBLETAP_TIME = 300;

  function pointerDown(e) {
    var now = new Date();
    if (now - this.lastDownTime < DOUBLETAP_TIME) {
      this.lastDownTime = 0;
      var payload = {
      };
      window._createCustomEvent('gesturedoubletap', e.target, payload);
    }
    this.lastDownTime = now;
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitDoubleTaps(el) {
    el.addEventListener('pointerdown', pointerDown);
  }

  exports.Gesture._gestureHandlers.gesturedoubletap = emitDoubleTaps;

})(window);
