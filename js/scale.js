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
   * Calculate the center of the two pointers.
   */
  PointerPair.prototype.center = function() {
    return [(this.p1.pageX + this.p2.pageX) / 2, (this.p1.pageY + this.p2.pageY) / 2];
  };

  /**
   * Calculate the distance between the two pointers.
   */
  PointerPair.prototype.span = function() {
    var dx = this.p1.pageX - this.p2.pageX;
    var dy = this.p1.pageY - this.p2.pageY;
    return Math.sqrt(dx*dx + dy*dy);
  };

  /**
   * Given a reference pair, calculate the scale multiplier difference.
   */
  PointerPair.prototype.scaleSince = function(referencePair) {
    var originalSpan = this.span();
    var referenceSpan = referencePair.span();
    if (referenceSpan === 0) {
      return 0;
    }
    else return originalSpan / referenceSpan;
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
          scale: scale,
          centerX: (e.target.scaleReferencePair.p1.clientX + e.target.scaleReferencePair.p2.clientX) / 2,
          centerY: (e.target.scaleReferencePair.p1.clientY + e.target.scaleReferencePair.p2.clientY) / 2
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
