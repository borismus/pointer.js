Unified touch/mouse/pen handling with gesture support
=====================================================

For background and motivation, see this blog post:
<http://smus.com/mouse-touch-pointer/>.

# Implementation

This is a library that enables MSPointer*-style pointer events in all
browsers.

## Pointer events

The whole point of pointer.js is to use pointer* events instead of
mouse* and touch*. You can do this by subscribing to these events in the
same way as you would regular events:

    var el = document.querySelector(mySelector);
    el.addEventListener('pointerdown', function(e) {
      // ...
    });

Approach: override addEventListener to intercept `pointer*` events.
(Theoretical alternative: have an explicit `el.emitPointers` call.)

As soon as you start listening for `pointer*` events, both mouse and
touch events are hijacked, and do not fire.

The event payload for a pointer event includes the following important
features:

- `{String} pointerType` - the kind of pointer it is (touch, mouse, pen)
- `{Object} originalEvent` - the original event payload from the
  underlying event.
- `{Function} getPointerList()` - gets the list of active pointers (ie
  mouse pressed, fingers on the screen).

The bottom line is that you code your input to a single spec: pointer
events from pointer.js. The library abstracts all of the input
differences for you under the consolidated model.

### Pointer API

Events: `pointerdown, pointermove, pointerup`

Event payload class: `originalEvent, pointerType, getPointerList()`

Pointer class: `x, y, type`

## Gesture events

Now that we have a solid touch/mouse/stylus abstraction, we can build
higher level gestures on top. Some interesting events to support are
tap, double tap, longpress, swipe, pinch-zoom, and rotate.

### Gesture API

Emit new gesture* events. For example, `gesturedoubletap`,
`gesturelongpress`, `gesturescale`, etc. This is incompatible with
Safari's gesturestart events, but in the future can also be consolidated
under one umbrella.

This is done with the same `addEventListener` hack as is used for
pointer events. Each of these `gesture*` events has a recognizer
associated with it. If, for example, gesturescale is specified, the
pointer-event-based recognizer gets pulled into the event loop.

Each gesture has a custom event associated with it. This function takes
an HTMLElement as its only argument. The following gestures are
supported:

    gesture           gesture event
    ===================================
    Double Tap        gesturedoubletap
    Long Press        gesturelongpress
    Scale             gesturescale

This is a nice place to contribute if you're so inclined. Gesture
recognizers can easily be plugged into this architecture. They are
completely standalone and can be registered easily. For an example, take
a look at the [`doubletap` handler][doubletap].

The scale gesture implements a pinch-zoom and provides the scaling factor
as part of the event payload through `evt.scale`.

# Demos

- [Pointer plotter][demo-plot] (adapted from [Seb][seb])
- [Video game controller][demo-vg] (adapted from [Seb][seb])
- [Multi-touch drawing][demo-draw] (adapted from [Paul and others][paul])
- [Gesture event logger][demo-gesture] (supports scale, longpress and doubletap)
- [Pointer event logger][demo-pointer]

[demo-draw]: http://borismus.github.com/pointer.js/demos/draw.html
[demo-pointer]: http://borismus.github.com/pointer.js/demos/basic-pointers.html
[demo-gesture]: http://borismus.github.com/pointer.js/demos/basic-gestures.html
[demo-plot]: http://borismus.github.com/pointer.js/demos/pointers.html
[demo-vg]: http://borismus.github.com/pointer.js/demos/control.html
[seb]: http://seb.ly/2011/04/multi-touch-game-controller-in-javascripthtml5-for-ipad/
[paul]: http://paulirish.com/demo/multi


# Open questions

- Will the way addEventListener is overridden cause problems in the
  future?

- Is the overhead of firing a custom event vs. calling a function too
  high? See [this test on jsperf.com][jsperf]

- Does the gesture approach make sense on iOS, which provides built-in
  gesture support? How to consolidate?


[jsperf]: http://jsperf.com/events-vs-functions/3
[demos]: http://borismus.github.com/pointer.js/demos/draw.html
[doubletap]: https://github.com/borismus/pointer.js/blob/master/js/doubletap.js
