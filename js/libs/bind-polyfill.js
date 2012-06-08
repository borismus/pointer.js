// Source:
// https://github.com/slightlyoff/cassowary-js-refactor/blob/master/src/c.js#L10-23
// For Safari 5.x. Go-go-gadget ridiculously long release cycle!
try {
  (function(){}).bind(scope);
} catch (e) {
  Object.defineProperty(Function.prototype, "bind", {
    value: function(scope) {
      var f = this;
      return function() { return f.apply(scope, arguments); };
    },
    enumerable: false,
    configurable: true,
    writable: true
  });
}

