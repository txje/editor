/*
 * the_editor/BitmapUI
 *
 * This module creates and controls the UI over an underlying bitmap
 * image
 */

$(function() {
  function BitmapUI(bitmap, parent) {
    
    function resize() {
      $canvas.width(width * zoom);
      $canvas.height(height * zoom);
      redraw();
    }

    function redraw() {
      clear();
      var ary = bitmap.to_array();
      for(var y = 0; y < bitmap.height()) {
        for(var x = 0; x < bitmap.width()) {
          put_pixel(x, y, ary[y][x]);
        }
      }
    }

    function clear() {
      ctx.clearRect(0, 0, width*zoom, height*zoom);
    }

    function zoom(new_zoom) {
      zoom = new_zoom;
      resize();
    }

    function put_pixel(x, y, color) {
      ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + (color[3]/255) + ")";
      ctx.fillRect(x*zoom, y*zoom, (x+1)*zoom, (y+1)*zoom);
      bitmap.set_pixel(x, y, color);
    }

    this.set_color(color) {
      current_color = color;
    }

    function draw_here(e) {
      put_pixel(e.clientX / zoom, e.clientY / zoom, current_color);
    }


    // --------------------
    // init
    // --------------------

    var $canvas = $('<canvas>');
    var zoom = 1;
    var width = bitmap.width();
    var height = bitmap.height();
    parent.append($canvas);

    var ctx = $canvas[0].getContext('2d');
    var default_color = [0, 0, 0, 0]; // transparent
    var current_color = [0, 0, 0, 1]; // solid black

    $canvas.click(function(e) {
      draw_here(e);
    }.bind(this));

    // drawing while dragging the mouse
    var dragging = false;
    $canvas.mousedown(function() {
      dragging = true;
    }.bind(this));
    $canvas.mousedown(function() {
      dragging = false;
    }.bind(this));
    $canvas.mousemove(function(e) {
      if(dragging) {
        draw_here(e);
      }
    }.bind(this));

    resize();

  }
});