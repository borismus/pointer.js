function transformRecognizerTest() {
  // Enable transform recognition on the main element.
  target = document.querySelector('#target');
  // Hook up listeners for scale and rotation events.
  r = new TransformRecognizer(target);
  r.onScale(function(data) {
    // Output things to the console.
    console.log('scale factor: ', data.scale,
                ' position: ', data.x, ',', data.y);
    target.style.webkitTransform = 'scale(' + data.scale + ')';
  });
  r.onRotate(function(data) {
    // Output things to the console.
    console.log('rotation angle: ', data.rotation,
                ' position: ', data.x, ',', data.y);
    target.style.webkitTransform = 'rotate(' + data.rotation + 'deg)';
  });
}

function applyTransform(t) {
}

transformRecognizerTest();
