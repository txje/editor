/*
 * the_editor/Bitmap
 *
 * A javascript file-level representation of a bitmap image, in some format
 */

define({
  Bitmap: function(width, height) {

    var headless_canvas = $("<canvas>");
    headless_canvas.attr("width", width);
    headless_canvas.attr("height", height);
    var headless_ctx = headless_canvas[0].getContext("2d");
    // initialized with invisible black (rgba 0,0,0,0) pixels
    // a 1d array with 4 values (RGBA, 0-255) for each pixel, row-major order
    var imageData = headless_ctx.createImageData(width, height);
    var pixelData = imageData.data;

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
        var row = [];
        for(var x = 0; x < width; x++) {
          var offset = (y*width + x) * 4;
          row.push([pixelData[offset], pixelData[offset + 1], pixelData[offset + 2], pixelData[offset + 3]/255]);
        }
        data.push(row);
      }
      return data;
    }

    // params
    //  x: 0-width
    //  y: 0-height
    //  color: [R, G, B, A], each 0-255
    this.set_pixel = function(x, y, color) {
      var offset = (y*width + x) * 4;
      pixelData[offset] = color[0];
      pixelData[offset + 1] = color[1];
      pixelData[offset + 2] = color[2];
      pixelData[offset + 3] = color[3] * 255;
    }

    this.get_pixel = function(x, y) {
      var offset = (y*width + x) * 4;
      return [pixelData[offset], pixelData[offset+1], pixelData[offset+2], pixelData[offset+3]];
    }

    this.get_data = function() {
      return {
        "width": width,
        "height": height,
        "src": this.export_PNG()
      };
    }

    this.load_data = function(data, callback) {
      this.import_PNG(data, callback);
    }

    this.export_PNG = function() {
      headless_ctx.putImageData(imageData, 0, 0);
      return headless_canvas[0].toDataURL("image/png");
    }

    // imports a given PNG by URL
    // automatically resizes the image to match the imported PNG
    this.import_PNG = function(src, callback) {
      var img = new Image();
      img.src = src;
      img.onload = function() {
        width = img.width;
        height = img.height;
        headless_canvas.attr("width", width);
        headless_canvas.attr("height", height);
        headless_ctx.drawImage(img, 0, 0);
        imageData = headless_ctx.getImageData(0, 0, width, height);
        pixelData = imageData.data;
        callback();
      }
    }
  }
});
