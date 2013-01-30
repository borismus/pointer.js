/**
 * Gesture recognizer for the `longpress` gesture.
 *
 * Longpress happens when pointer is pressed and doesn't get released
 * for a while (without movement).
 */
(function(exports) {
  var LONGPRESS_TIME = 600;
  var WIGGLE_THRESHOLD = 5;

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

    // Something went down. Clear the last press if there was one.
    clearTimeout(this.longPressTimer);

    var pointers = e.getPointerList();

    // check that we only have one pointer down
    if(pointers.length === 1) {

      // cache the position of the pointer on the target
      e.target.longpressInitPosition = new PointerPosition(pointers[0]);

      // Start a timer.
      this.longPressTimer = setTimeout(function() {
        payload = {};
        window._createCustomEvent('gesturelongpress', e.target, payload);
      }, LONGPRESS_TIME);

    }
    
  }

  function pointerMove(e) {
    var pointers = e.getPointerList();
    
    if(e.pointerType === PointerTypes.MOUSE) {
      // if the pointer is a mouse we cancel the longpress 
      // as soon as it starts wiggling around
      clearTimeout(this.longPressTimer);
    }
    else if(pointers.length === 1) {
      // but if the pointer is something else we allow a 
      // for a bit of smudge space
      var pos = e.target.longpressInitPosition;
      
      if(pos && pos.calculateSquaredDistance(pointers[0]) > WIGGLE_THRESHOLD * WIGGLE_THRESHOLD) {
        clearTimeout(this.longPressTimer);
      }
    }
    
  }

  function pointerUp(e) {
    clearTimeout(this.longPressTimer);
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitLongPresses(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturelongpress = emitLongPresses;

})(window);
