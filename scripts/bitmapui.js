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
      ctx.clearRect(x*zoom, y*zoom, zoom, zoom);
      ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
      ctx.fillRect(x*zoom, y*zoom, zoom, zoom);
      bitmap.set_pixel(x, y, color);
    }

    this.set_color = function(color) {
      current_color = color;
    }

    function get_image_coords(e) {
      var x = Math.floor((e.pageX - $canvas.offset().left) / zoom);
      var y = Math.floor((e.pageY - $canvas.offset().top) / zoom);
      return [x,y];
    }

    function draw_here(e) {
      var coords = get_image_coords(e);
      put_pixel(coords[0], coords[1], current_color);
    }

    function get_here(e) {
      var coords = get_image_coords(e);
      return bitmap.get_pixel(coords[0], coords[1]);
    }

    function pour_here(e) {
    }

    this.set_click = function(action, callback) {
      var fn = null;
      if(action == "draw")
        fn = draw_here;
      else if(action == "pick")
        fn = get_here;
      else if(action == "pour")
        fn = pour_here;

      if(callback != null) {
        mouse_callback = function(e) {
          callback(fn(e));
        }
      } else {
        mouse_callback = fn;
      }
    }

    this.swap_colors = function(from, to) {
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

    var mouse_callback = draw_here;

    $canvas.click(function(e) {
      mouse_callback(e);
    }.bind(this));

    // drawing while dragging the mouse
    var dragging = false;
    $canvas.mousedown(function(e) {
      e.originalEvent.preventDefault(); // prevent text-selection cursor
      dragging = true;
    }.bind(this));
    $canvas.mouseup(function() {
      dragging = false;
    }.bind(this));
    $canvas.mousemove(function(e) {
      if(dragging) {
        mouse_callback(e);
      }
    }.bind(this));

    resize();
  }
});
