(function(exports) {
  var MOUSE_ID = 1;

  function Pointer(identifier, type, event) {
    this.screenX = event.screenX || 0;
    this.screenY = event.screenY || 0;
    this.pageX = event.pageX || 0;
    this.pageY = event.pageY || 0;
    this.clientX = event.clientX || 0;
    this.clientY = event.clientY || 0;
    this.tiltX = event.tiltX || 0;
    this.tiltY = event.tiltY || 0;
    this.pressure = event.pressure || 0.0;
    this.hwTimestamp = event.hwTimestamp || 0;
    this.pointerType = type;
    this.identifier = identifier;
  }

  var PointerTypes = {
    TOUCH: 'touch',
    MOUSE: 'mouse',
    PEN:   'pen'
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
    var pointer;
    if (this.touchList) {
      for (var i = 0; i < this.touchList.length; i++) {
        var touch = this.touchList[i];
        // Add 2 to avoid clashing with the mouse identifier.
        pointer = new Pointer(touch.identifier + 2, PointerTypes.TOUCH, touch);
        pointers.push(pointer);
      }
    } else if (this.msPointerList) {
      for (var identifier in this.msPointerList) {
        if (!this.msPointerList.hasOwnProperty(identifier)) continue;
        pointer = this.msPointerList[identifier];
        pointer = new Pointer(identifier, pointer.textPointerType, pointer);
        pointers.push(pointer);
      }
    }
    if (this.mouseEvent) {
      pointers.push(new Pointer(MOUSE_ID, PointerTypes.MOUSE, this.mouseEvent));
    }
    return pointers;
  }

  function createCustomEvent(eventName, target, payload) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    for (var k in payload) {
      event[k] = payload[k];
    }
    target.dispatchEvent(event);
  }

  /*************** Mouse event handlers *****************/

  function mouseDownHandler(event) {
    event.preventDefault();
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    if (event.target.mouseEvent) {
      setMouse(event);
    }
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function mouseUpHandler(event) {
    event.preventDefault();
    unsetMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /*************** Touch event handlers *****************/

  function touchStartHandler(event) {
    console.log('touchstart');
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function touchMoveHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function touchEndHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  function mouseOutHandler(event) {
    if (event.target.mouseEvent) {
      console.log(event);
      event.preventDefault();
      unsetMouse(event);
      var payload = {
        pointerType: 'mouse',
        getPointerList: getPointerList.bind(this),
        originalEvent: event
      };
      createCustomEvent('pointerup', event.target, payload);
    }
  }

  /*************** MSIE Pointer event handlers *****************/

  function pointerDownHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = true;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };

    createCustomEvent('pointerdown', event.target, payload);
  }

  function pointerMoveHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE && !event.target.msMouseDown) {
      return;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function pointerUpHandler(event) {
    if (event.target.msPointerList) {
      delete event.target.msPointerList[event.pointerId];
    }
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = false;
    }
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /**
   * Causes the passed in element to broadcast pointer events instead
   * of mouse/touch/etc events.
   */
  function emitPointers(el) {
    if (!el.isPointerEmitter) {
      // Latch on to all relevant events for this element.
      if (isPointer()) {
        el.addEventListener('pointerdown', pointerDownHandler);
        el.addEventListener('pointermove', pointerMoveHandler);
        el.addEventListener('pointerup', pointerUpHandler);
      } else if (isMSPointer()) {
        el.addEventListener('MSPointerDown', pointerDownHandler);
        el.addEventListener('MSPointerMove', pointerMoveHandler);
        el.addEventListener('MSPointerUp', pointerUpHandler);
      } else {
        if (isTouch()) {
          el.addEventListener('touchstart', touchStartHandler);
          el.addEventListener('touchmove', touchMoveHandler);
          el.addEventListener('touchend', touchEndHandler);
        }
        el.addEventListener('mousedown', mouseDownHandler);
        el.addEventListener('mousemove', mouseMoveHandler);
        el.addEventListener('mouseup', mouseUpHandler);
        // Necessary for the edge case that the mouse is down and you drag out of
        // the area.
        el.addEventListener('mouseout', mouseOutHandler);
      }

      el.isPointerEmitter = true;
    }
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports touch events.
   */
  function isTouch() {
    return Modernizr.touch;
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports MSIE pointer
   * events.
   */
  function isMSPointer() {
    return window.navigator.msPointerEnabled;
  }

   /**
   * @return {Boolean} Returns true iff this user agent supports pointer
   * events.
   */
  function isPointer() {
    return window.navigator.pointerEnabled;
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
  function augmentAddEventListener(baseElementClass, customEventListener) {
    var oldAddEventListener = baseElementClass.prototype.addEventListener;
    baseElementClass.prototype.addEventListener = function(type, listener, useCapture) {
      customEventListener.call(this, type, listener, useCapture);
      oldAddEventListener.call(this, type, listener, useCapture);
    };
  }

  function synthesizePointerEvents(type, listener, useCapture) {
    if (type.indexOf('pointer') === 0) {
      emitPointers(this);
    }
  }

  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
  // doesn't actually affect anything. Special case for Firefox:
  if (navigator.userAgent.match(/Firefox/)) {
    // TODO: fix this for the general case.
    augmentAddEventListener(HTMLDivElement, synthesizePointerEvents);
    augmentAddEventListener(HTMLCanvasElement, synthesizePointerEvents);
  } else {
    augmentAddEventListener(HTMLElement, synthesizePointerEvents);
  }

  exports._createCustomEvent = createCustomEvent;
  exports._augmentAddEventListener = augmentAddEventListener;
  exports.PointerTypes = PointerTypes;
})(window);
