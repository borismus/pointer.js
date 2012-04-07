/**
 * Gesture recognizer for compound multi-touch transformations.
 *
 * 1. pinch/zoom/scale gesture.
 * 2. rotate gesture.
 */

function TransformRecognizer(element) {
  // Reference positions for the start of the transformation.
  this.referencePair = null;

  // Bind touch event handlers to this element.
  element.addEventListener('touchstart', this.touchStartHandler.bind(this));
  element.addEventListener('touchmove', this.touchMoveHandler.bind(this));
  element.addEventListener('touchend', this.touchEndHandler.bind(this));
  this.element = element;

  // Object of callbacks this function provides.
  this.callbacks = {
    rotate: null,
    scale: null
  };

  // Define gesture states.
  this.Gestures = {
    NONE: 0,
    ROTATE: 1,
    SCALE: 2
  };
  // Define thresholds for gestures.
  this.Thresholds = {
    SCALE: 0.2, // percentage difference.
    ROTATION: 5  // degrees.
  };
  // The current gesture of this transformation.
  this.currentGesture = this.Gestures.NONE;
}

/**
 * Touch event handlers.
 */
TransformRecognizer.prototype.touchStartHandler = function(e) {
  var touches = e.touches;
  for (var i = 0; i < touches.length; i++) {
    this.log('identifier: ' + touches[i].identifier);
  }
  // If there are now exactly 2 touches, this is the initial position.
  if (touches.length == 2) {
    // Save these two points as the reference.
    this.referencePair = new TouchPair(touches);
  }
};

TransformRecognizer.prototype.touchMoveHandler = function(e) {
  // Prevent default behavior of scrolling.
  e.preventDefault();
  console.log('current gesture', this.currentGesture);
  var touches = e.touches;
  // Check if there are exactly 2 fingers touching this element.
  if (touches.length == 2) {
    // Get the current touches as a TouchPair.
    var currentPair = new TouchPair(touches);
    // Compute angle and scale differences WRT reference position.
    var angle = currentPair.angleSince(this.referencePair);
    var scale = currentPair.scaleSince(this.referencePair);

    // Check if we're already in a gesture locked state.
    if (this.currentGesture == this.Gestures.NONE) {
      if (angle > this.Thresholds.ROTATION ||
         -angle > this.Thresholds.ROTATION) {
        // If rotated enough, start a rotation.
        this.currentGesture = this.Gestures.ROTATE;
      } else if (scale > 1 + this.Thresholds.SCALE ||
                 scale < 1 - this.Thresholds.SCALE) {
        // Otherwise if scaled enough, start a scaling gesture.
        this.currentGesture = this.Gestures.SCALE;
      }
    }
    var center = currentPair.center()
    // Handle known gestures.
    if (this.currentGesture == this.Gestures.ROTATE) {
      // If we're already rotating, callback with the rotation amount.
      this.callbacks.rotate({
        rotation: angle,
        x: center.x,
        y: center.y
      });
    }
    if (this.currentGesture == this.Gestures.SCALE) {
      // If already scaling, callback with scale amount.
      this.callbacks.scale({
        scale: scale,
        x: center.x,
        y: center.y
      });
    }
  }
};

TransformRecognizer.prototype.touchEndHandler = function(e) {
  var touches = e.touches;
  // If there are less than 2 fingers, reset current gesture.
  if (touches.length < 2) {
    this.currentGesture = this.Gestures.NONE;
  }
};

/**
 * Registers a callback to fire when a pinch occurs.
 */
TransformRecognizer.prototype.onScale = function(callback) {
  this.callbacks.scale = callback;
};

/**
 * Registers a callback to fire when a rotate occurs.
 */
TransformRecognizer.prototype.onRotate = function(callback) {
  this.callbacks.rotate = callback;
};

TransformRecognizer.prototype.log = function(msg) {
  this.element.innerHTML += msg + '<br/>';
};

/**
 * Represents a pair of fingers touching the screen.
 */
function TouchPair(touchList) {
  // Grab the first two touches from the list.
  this.t1 = new Touch(touchList[0].pageX, touchList[0].pageY);
  this.t2 = new Touch(touchList[1].pageX, touchList[1].pageY);
}

/**
 * Given a reference position, calculate how much rotation happened.
 */
TouchPair.prototype.angleSince = function(referencePair) {
  // TODO: handle the edge case of going between 0 and 360.
  // eg. the difference between 355 and 0 is 5.
  return this.angle() - referencePair.angle();
};

/**
 * Given a reference position, calculate the scale multiplier.
 */
TouchPair.prototype.scaleSince = function(referencePair) {
  return this.span() / referencePair.span();
};

/**
 * Calculate the center of this transformation.
 */
TouchPair.prototype.center = function() {
  var x = (this.t1.x + this.t2.x) / 2
  var y = (this.t1.y + this.t2.y) / 2
  return new Touch(x, y);
};

/**
 * Calculate the distance between the two touch points.
 */
TouchPair.prototype.span = function() {
  var dx = this.t1.x - this.t2.x;
  var dy = this.t1.y - this.t2.y;
  return Math.sqrt(dx*dx + dy*dy);
};

/**
 * Calculate the angle (in degrees, 0 < a < 360) between the touch points.
 */
TouchPair.prototype.angle = function() {
  var dx = this.t1.x - this.t2.x;
  var dy = this.t1.y - this.t2.y;
  return Math.atan2(dy, dx) * 180 / Math.PI;
};

function Touch(x, y) {
  this.x = x;
  this.y = y;
}
