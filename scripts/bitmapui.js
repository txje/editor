/*
 * the_editor/BitmapUI
 *
 * This module creates and controls the UI over an underlying bitmap
 * image
 */

define({
  BitmapUI: function(bitmap, parent) {
    
    function resize() {
      $canvas.attr('width', width * zoom);
      $canvas.attr('height', height * zoom);
      $canvas.width(width * zoom);
      $canvas.height(height * zoom);
      redraw();
    }

    function redraw() {
      clear();
      var ary = bitmap.to_array();
      for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
          put_pixel(x, y, ary[y][x]);
        }
      }
    }

    this.reload = function(new_bitmap) {
      bitmap = new_bitmap;
      width = bitmap.width();
      height = bitmap.height();
      resize();
    }

    function clear() {
      ctx.clearRect(0, 0, width*zoom, height*zoom);
    }

    this.zoom = function(new_zoom) {
      zoom = new_zoom;
      resize();
    }

    function put_pixel(x, y, color) {
      ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
      ctx.fillRect(x*zoom, y*zoom, zoom, zoom);
      bitmap.set_pixel(x, y, color);
    }

    this.set_color = function(color) {
      current_color = color;
    }

    function draw_here(e) {
      var x = e.pageX - $canvas.offset().left;
      var y = e.pageY - $canvas.offset().top;
      put_pixel(Math.floor(x / zoom), Math.floor(y / zoom), current_color);
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
