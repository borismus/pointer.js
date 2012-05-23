(function(exports) {

  function Pointer(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  var PointerTypes = {
    TOUCH: 'touch',
    MOUSE: 'mouse'
  };

  function setMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = mouseEvent;
  }

  function unsetMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = null;
  }

  function setTouch(touchEvent) {
    touchEvent.target.touchList = touchEvent.targetTouches;
  }

  /**
   * Returns an array of all pointers currently on the screen.
   */
  function getPointerList() {
    // Note: "this" is the element.
    var pointers = [];
    if (this.touchList) {
      for (var i = 0; i < this.touchList.length; i++) {
        var touch = this.touchList[i];
        var pointer = new Pointer(touch.pageX, touch.pageY, PointerTypes.TOUCH);
        pointers.push(pointer);
      }
    }
    if (this.mouseEvent) {
      pointers.push(new Pointer(this.mouseEvent.pageX, this.mouseEvent.pageY,
                                  PointerTypes.MOUSE));
    }
    return pointers;
  }

  function createPointerEvent(eventName, target, payload) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    for (var k in payload) {
      event[k] = payload[k];
    }
    target.dispatchEvent(event);
  }

  function touchStartHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointerdown', event.target, payload);
  }

  function mouseDownHandler(event) {
    event.preventDefault();
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointerdown', event.target, payload);
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointermove', event.target, payload);
  }

  function touchMoveHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointermove', event.target, payload);
  }

  function touchEndHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointerup', event.target, payload);
  }

  function mouseUpHandler(event) {
    event.preventDefault();
    unsetMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createPointerEvent('pointerup', event.target, payload);
  }

  function mouseOutHandler(event) {
    event.preventDefault();
    unsetMouse(event);
  }

  /**
   * Causes the passed in element to broadcast pointer events instead
   * of mouse/touch/etc events.
   */
  function emitPointers(el) {
    if (!el.isPointerEmitter) {
      // Latch on to all relevant events for this element.
      el.addEventListener('touchstart', touchStartHandler);
      el.addEventListener('touchmove', touchMoveHandler);
      el.addEventListener('touchend', touchEndHandler);
      el.addEventListener('mousedown', mouseDownHandler);
      el.addEventListener('mousemove', mouseMoveHandler);
      el.addEventListener('mouseup', mouseUpHandler);

      // Necessary for the edge case that the mouse is down and you drag out of
      // the area.
      el.addEventListener('mouseout', mouseOutHandler);

      el.isPointerEmitter = true;
    }
  }

  /**
   * Option 1: Require emitPointers call on all pointer event emitters.
   */
  //exports.pointer = {
  //  emitPointers: emitPointers,
  //};

  /**
   * Option 2: Replace addEventListener with a custom version.
   */
  var oldAddEventListener = HTMLElement.prototype.addEventListener;
  var pointerElements = {};
  HTMLElement.prototype.addEventListener = function(type, listener, useCapture) {
    if (type.indexOf('pointer') == 0) {
      emitPointers(this);
    }
    oldAddEventListener.call(this, type, listener, useCapture);
  }

  exports.createEvent = createPointerEvent;

})(window);
