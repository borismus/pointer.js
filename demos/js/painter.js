// canvasDrawr originally from Mike Taylr  http://miketaylr.com/
// Tim Branyen massaged it: http://timbranyen.com/
// and i did too. with multi touch.
// and boris fixed some touch identifier stuff to be more specific.
// and then added pointer events.

var CanvasDrawr = function(options) {
  // grab canvas element
  var canvas = document.getElementById(options.id),
  ctxt = canvas.getContext("2d");

  canvas.style.width = '100%'
  canvas.width = canvas.offsetWidth;
  canvas.style.width = '';

  // set props from options, but the defaults are for the cool kids
  ctxt.lineWidth = options.size || Math.ceil(Math.random() * 35);
  ctxt.lineCap = options.lineCap || "round";
  ctxt.pX = undefined;
  ctxt.pY = undefined;

  var lines = [,,];
  var offset = $(canvas).offset();

  var self = {
    //bind click events
    init: function() {
      //set pX and pY from first click

      canvas.addEventListener('pointerdown', self.preDraw, false);
      canvas.addEventListener('pointermove', self.draw, false);


    },

    preDraw: function(event) {

      var pointers = event.getPointerList();
      $.each(pointers, function(i, pointer) {

        var id      = pointer.identifier || 0, 
        colors  = ["red", "green", "yellow", "blue", "magenta", "orangered"],
        mycolor = colors[Math.floor(Math.random() * colors.length)];

        lines[id] = { x     : this.pageX - offset.left, 
          y     : this.pageY - offset.top, 
          color : mycolor
        };
      });

      event.preventDefault();
    },

    draw: function(event) {
      var e = event, hmm = {};
      var pointers = event.getPointerList();

      $.each(pointers, function(i, pointer) {
        var id = pointer.identifier || 0,
        moveX = this.pageX - offset.left - lines[id].x,
        moveY = this.pageY - offset.top - lines[id].y;

        var ret = self.move(id, moveX, moveY);
        lines[id].x = ret.x;
        lines[id].y = ret.y;
      });

      event.preventDefault();
    },

    move: function(i, changeX, changeY) {
      ctxt.strokeStyle = lines[i].color;
      ctxt.beginPath();
      ctxt.moveTo(lines[i].x, lines[i].y);

      ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
      ctxt.stroke();
      ctxt.closePath();

      return { x: lines[i].x + changeX, y: lines[i].y + changeY };
    }
  };

  return self.init();
};


$(function(){
  var super_awesome_multitouch_drawing_canvas_thingy = new CanvasDrawr({id:"example", size: 15 });
});

