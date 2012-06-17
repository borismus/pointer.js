/**
 * Gesture recognizer for the `scale` gesture.
 *
 * Scale happens when two fingers are placed on the screen, and then
 * they move so the the distance between them is greater or less than a
 * certain threshold.
 */
(function(exports) {

  var SCALE_THRESHOLD = 0.2;

  function PointerPair(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  /**
   * Calculate the distance between the two pointers.
   */
  PointerPair.prototype.span = function() {
    var dx = this.p1.x - this.p2.x;
    var dy = this.p1.y - this.p2.y;
    return Math.sqrt(dx*dx + dy*dy);
  };

  /**
   * Given a reference pair, calculate the scale multiplier difference.
   */
  PointerPair.prototype.scaleSince = function(referencePair) {
    return this.span() / referencePair.span();
  };

  function pointerDown(e) {
    var pointerList = e.getPointerList();
    // If there are exactly two pointers down,
    if (pointerList.length == 2) {
      // Record the initial pointer pair.
      e.target.scaleReferencePair = new PointerPair(pointerList[0],
                                                    pointerList[1]);
    }
  }

  function pointerMove(e) {
    var pointerList = e.getPointerList();
    // If there are two pointers down, compare to the initial pointer pair.
    if (pointerList.length == 2 && e.target.scaleReferencePair) {
      var pair = new PointerPair(pointerList[0], pointerList[1]);
      // Compute the scaling value according to the difference.
      var scale = pair.scaleSince(e.target.scaleReferencePair);
      // If the movement is drastic enough:
      if (Math.abs(1 - scale) > SCALE_THRESHOLD) {
        // Create the scale event as a result.
        var payload = {
          scale: scale
        };
        window._createCustomEvent('gesturescale', e.target, payload);
      }
    }
  }

  function pointerUp(e) {
    e.target.scaleReferencePair = null;
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitScale(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturescale = emitScale;

})(window);
