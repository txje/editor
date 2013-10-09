/*
 * the_editor/main
 *
 * Initialize and connect system components:
 * 1. Document controller/toolbox UI
 * 2. Document/image UI
 * 3. Document/image model
 * 4. File system module
 *
 * This module contains general document/editing actions and UI
 */

$(function() {
  function Editor() {

    var image = new Bitmap(16, 16);
    var doc = new BitmapUI(image, $('#bitmap'));
    var controller = new BitmapControllerUI(doc, $('#controller'));
    var fs = new LocalStorageFS();

    // load a file into the editor (selected from the opener)
    function load(filename) {
      image = fs.load(filename); // should create an object of the appropriate type (Bitmap)
      doc.reload(image);
    }

    function create_new(width, height) {
      image = new Bitmap(width, height);
      doc.reload(image);
    }

    function save(filename) {
      return fs.save(filename, image);
    }

    // list files
    function open() {
      fs.open();
    }

  }
});
