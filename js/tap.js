/**
 * Gesture recognizer for the `gesturetap` gesture.
 *
 * Taps happen when an element is pressed and then released.
 */
(function(exports) {

  var TAP_TIME = 600; // this should be the same with longpress trigger time

  function pointerDown(e) {
    var pointers = e.getPointerList();
    if (pointers.length != 1) return;
    e.target.tapInitPosition = pointers[0];
    e.target.addEventListener('pointerup', pointerUp);
    setTimeout(function () {
      e.target.removeEventListener('pointerup', pointerUp);
    }, TAP_TIME);
  }

  function pointerUp(e) {
    var pointers = e.getPointerList();
    if (pointers.length) return;
    e.target.removeEventListener('pointerup', pointerUp);
    if (this.lastDownTime === 0) return; // doubletap just triggered
    var payload = {
      pageX: e.target.tapInitPosition.pageX,
      pageY: e.target.tapInitPosition.pageY
    };
    window._createCustomEvent('gesturetap', e.target, payload);
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitTaps(el) {
    el.addEventListener('pointerdown', pointerDown);
  }

  exports.Gesture._gestureHandlers.gesturetap = emitTaps;

})(window);
