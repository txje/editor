/*
 * the_editor/Bitmap
 *
 * A javascript file-level representation of a bitmap image, in some format
 */

$(function() {
  function Bitmap(width, height) {

    var headless_canvas = $("<canvas>");
    headless_canvas.attr("width", width);
    headless_canvas.attr("height", height);
    var headless_ctx = headless_canvas[0].getContext("2d");
    // initialized with invisible black (rgba 0,0,0,0) pixels
    // a 1d array with 4 values (RGBA, 0-255) for each pixel, row-major order
    var imageData = headless_ctx.createImageData(width, height);

    this.width = function() {
      return width;
    }
    this.height = function() {
      return height;
    }

    // reformats and returns the raw data array in a more digestible format
    this.to_array = function() {
      var data = [];
      for(var y = 0; y < height; y++) {
        data.push([]);
        for(var x = 0; x < width; x++) {
          data.push([imageData[y*width + x], imageData[y*width + x + 1], imageData[y*width + x + 2], imageData[y*width + x + 3]);
        }
      }
      return data;
    }

    // params
    //  x: 0-width
    //  y: 0-height
    //  color: [R, G, B, A], each 0-255
    this.set_pixel = function(x, y, color) {
      imageData[y*width + x] = color[0];
      imageData[y*width + x + 1] = color[1];
      imageData[y*width + x + 2] = color[2];
      imageData[y*width + x + 3] = color[3];
    }

    this.export_PNG = function() {
      headless_ctx.putImageData(imageData);
      return headless_canvas.toDataURL("image/png");
    }

    // imports a given PNG by URL
    // automatically resizes the image to match the imported PNG
    this.import_PNG = function(src) {
      var img = new Image();
      img.src = src;
      img.onload = function() {
        headless_canvas.attr("width", img.width);
        headless_canvas.attr("height", img.height);
        headless_ctx.drawImage(img, 0, 0);
        imageData = headless_ctx.getImageData();
      }
    }
  }
}
