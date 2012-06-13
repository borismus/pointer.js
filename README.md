Unified touch/mouse/pen handling with gesture support
===
Inspired by IE10 [pointer events][ie-pointer].

[Try some demos][demos].

# Motivation/theory

Problems with touch on the web:

1. No unified story with mouse.
2. No gestures (tap, swipe, pinch-zoom)

## Unification

When building a touch-enabled web UI, developers still want it to work
with the mouse. Unfortunately this is hard because touch and mouse
events are completely separate, resulting in code like this:

    $(window).mousedown(function(e) { down(e.pageY); });
    $(window).mousemove(function(e) { move(e.pageY); });
    $(window).mouseup(function() { up(); });

    // Setup touch event handlers.
    $(window).bind('touchstart', function(e) {
      e.preventDefault();
      down(e.originalEvent.touches[0].pageY);
    });
    $(window).bind('touchmove', function(e) {
      e.preventDefault();
      move(e.originalEvent.touches[0].pageY);
    });
    $(window).bind('touchend', function(e) {
      e.preventDefault();
      up();
    });

There are nice approaches to tackling this problem, such as IE10's new
[pointer events][ie-pointer]. This is a nice unification of the above mentioned
problem, however it's for IE only.

## Gestures

Touch UIs often involve gestures that aren't easy for developers to
implement, such as pinch-zooming and rotation. However, on the web, due
to the simplicity of [the touch events][touch-spec], even implementing something
as simple as a button [is non-trivial][fast-button].

Frameworks like [Sencha Touch][sencha] and [Hammer.js][hammer] come to
the rescue to address the lack of gestures, however these both have
problems. Sencha comes as a complete package, and it's impossible to use
their gesture recognizer without using their whole framework (or
spending considerable effort trying to pull it out). Hammer.js, on the
other hand, doesn't actually implement gesture recognition for
pinchzoom, but instead relies on the touch spec providing non-standard
`rotation` and `scale` values [pioneered by Apple][apple-touch].

[ie-pointer]: http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx
[touch-spec]: https://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
[fast-button]: http://code.google.com/mobile/articles/fast_buttons.html
[apple-touch]: http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/doc/uid/TP40009358
[sencha]: http://dev.sencha.com/deploy/touch/examples/production/kitchensink/index.html#demo/touchevents
[hammer]: http://eightmedia.github.com/hammer.js/

# Implementation

This is a shim that essentially enables IE10 pointer events in all
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

# [Demos][demos]

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
