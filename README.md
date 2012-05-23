Pointer.js: A unified touch/mouse/pen input handler with gestures
===

Problems with touch on the web:

1. No unified story with mouse.
2. No gestures (tap, swipe, pinch-zoom)

# Unification

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

# Gestures

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

# Pointer events

The whole point of pointer.js is to use pointer* events instead of
mouse* and touch*. You can do this by subscribing to these events in the
same way as you would regular events:

    var el = document.querySelector(mySelector);
    el.addEventListener('pointerdown', function(e) {
      // ...
    });

- Approach 1: override addEventListener to intercept `pointer*` events.
- Approach 2: have an explicit `el.emitPointers` call.

This is necessary for performance reasons. Otherwise an event needs to
be fired for every single DOM element that is an ancestor of the target.

The event payload for a pointer event includes the following important
features:

- {String} pointerType - the kind of pointer it is (touch, mouse, pen)
- {Object} originalEvent - the original event payload from the
  underlying event.
- {Array} pointerList - the list of pointers available.

## Pointer API

Events: `pointerdown, pointermove, pointerup`

Event payload class: `originalEvent, pointers, targetPointers,
changedPointers, target, timestamp`

Pointer class: `{client, page, offset, screen, ...}{X, Y}, pointerType`

# Gesture events

Higher level gestures implemented on top of pointer events. Things to
support: `tap, double tap, longpress, swipe, pinch-zoom, rotate`.

We can still preserve the pointerType from pointer events so that it's
possible to know if the event came from a mouse or a finger.

## Gesture API

**Option 1**: to try to emulate the way MobileSafari does things, using
the `gesture*` events.

    el.addEventListener('gesturestart', function(e) {
      // e.rotation, e.scale for pinch-zoom and rotate.
    });

How do we handle swipes and long-presses then? Also, having all gestures
piled together under gestureevent is a bit awkward.

**Option 2**: emit new events entirely. For example, `gesturetap`,
`gesturedoubletap`, `gesturelongpress`, `gesturescale`, etc.

This can be done with the same `addEventListener` hack as proposed for
pointer events. Basically, each of these `gesture*` events has a gesture
recognizer associated with it. If, for example, gesturescale is
specified, the pointer-event-based recognizer gets pulled into the event
loop.

# Implementation details

Is it a lot of overhead to add extra addEventListener calls for each
gesture to be recognized?

TODO: Measure the overhead of firing a custom event vs. calling a
function. Write a test on jsperf.com

## Preventing certain kinds of events (unclear)

Interplay with native browser event handling (pinch-zoom, scroll, etc):
provide a more granular way of specifying which events to prevent, which
to allow.

    pointer.preventScroll(el);
