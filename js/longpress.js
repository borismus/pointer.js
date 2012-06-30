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
    this.x = pointer.x;
    this.y = pointer.y;
  }

  /**
   * calculate the distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateDistance = function(pointer) {
    var dx = this.x - pointer.x;
    var dy = this.y - pointer.y;
    return Math.sqrt(dx*dx + dy*dy);
  };


  function pointerDown(e) {

    // Something went down. Clear the last press if there was one.
    clearTimeout(this.longPressTimer);

    // check that we only have one pointer down
    if(e.getPointerList().length === 1) {

      // cache the position of the pointer on the target
      e.target.longpressInitPosition = new PointerPosition(e.getPointerList()[0]);

      // Start a timer.
      this.longPressTimer = setTimeout(function() {
        payload = {};
        window._createCustomEvent('gesturelongpress', e.target, payload);
      }, LONGPRESS_TIME);

    }
    
  }

  function pointerMove(e) {
    
    if(e.pointerType === PointerTypes.MOUSE) {
      // if the pointer is a mouse we cancel the longpress 
      // as soon as it starts wiggling around
      clearTimeout(this.longPressTimer);
    }
    else if(e.getPointerList().length === 1) {
      // but if the pointer is something else we allow a 
      // for a bit of smudge space
      var pos = e.target.longpressInitPosition;
      
      if(pos && pos.calculateDistance(e.getPointerList()[0]) > WIGGLE_THRESHOLD) {
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
