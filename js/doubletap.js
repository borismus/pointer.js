/**
 * Gesture recognizer for the `doubletap` gesture.
 *
 * Taps happen when an element is pressed and then released.
 */
(function(exports) {
  var DOUBLETAP_TIME = 300;
  var WIGGLE_THRESHOLD = 10;

  /**
   * A simple object for storing the position of a pointer.
   */
  function PointerPosition(pointer) {
    this.x = pointer.clientX;
    this.y = pointer.clientY;
  }

  /**
   * calculate the squared distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateSquaredDistance = function(pointer) {
    var dx = this.x - pointer.clientX;
    var dy = this.y - pointer.clientY;
    return dx*dx + dy*dy;
  };

  function pointerDown(e) {
    var pointers = e.getPointerList();
    if (pointers.length != 1) return;
    var now = new Date();
    if (now - this.lastDownTime < DOUBLETAP_TIME && this.lastPosition && this.lastPosition.calculateSquaredDistance(pointers[0]) < WIGGLE_THRESHOLD * WIGGLE_THRESHOLD) {
      this.lastDownTime = 0;
      this.lastPosition = null;
      var payload = {
      };
      window._createCustomEvent('gesturedoubletap', e.target, payload);
    }
    this.lastPosition = new PointerPosition(pointers[0]);
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
