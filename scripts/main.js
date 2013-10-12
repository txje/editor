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
 * - this is the file system controller
 */

requirejs(['bitmap', 'bitmapui', 'bitmapcontrollerui', 'localstoragefs'], function (b, bui, bcui, lsfs) {

  function Editor() {

    var image = new b.Bitmap(16, 16);
    var doc = new bui.BitmapUI(image, $('#bitmap'));
    doc.zoom(20);
    var controller = new bcui.BitmapControllerUI(doc, $('#controller'));
    var fs = new lsfs.LocalStorageFS("jeremy.editor"); // initialize with namespace

    // load a file into the editor (selected from the opener)
    function load(filename) {
      imagedata = fs.load(filename); // should create an object of the appropriate type (Bitmap)
      image = new b.load(imagedata);
      doc.reload(image);
    }

    function create_new(width, height) {
      image = new Bitmap(width, height);
      doc.reload(image);
    }

    function save(filename) {
      return fs.save(filename, image.get_data());
    }

    // list files
    function open() {
      fs.open();
    }

  }

  var editor = new Editor();

});
