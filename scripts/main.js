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

  var NS = "editor.jeremy";

  function Editor() {

    var image = new b.Bitmap(16, 16);
    var doc = new bui.BitmapUI(image, $('#bitmap'));
    doc.zoom(16);
    var controller = new bcui.BitmapControllerUI(doc, $('#controller'));
    var fs = new lsfs.LocalStorageFS(NS); // initialize with namespace

    // load a file into the editor (selected from the opener)
    function load(filename) {
      imagedata = fs.load(filename); // should create an object of the appropriate type (Bitmap)
      $('#filename').val(filename);
      var image = new b.Bitmap(imagedata.width, imagedata.height);
      image.load_data(imagedata.src, function() {
        doc.reload(image);
      }.bind(this));
    }

    function create_new(width, height) {
      image = new Bitmap(width, height);
      doc.reload(image);
    }

    $('#save').click(function() {
      var filename = $('#filename').val();
      var data = doc.get_file_data();
      console.log(data);
      return fs.save(filename, data);
    });

    // list files
    var file_dialog = $('#file_dialog');
    var files = $('#file_list');
    $('#open').click(function() {
      var file_list = fs.open();
      file_dialog.show();
      files.empty();
      if(file_list.length == 0) {
        files.append("No files.");
      }
      for(var f = 0; f < file_list.length; f++) {
        var file_row = $('<div>');
        file_row.addClass('file_row');

        var file_entry = $('<div>');
        var file_name = file_list[f];
        file_entry.append(file_name);
        file_entry.addClass('file_entry');
        file_entry.click(function(file_name) {
          load(file_name);
          file_dialog.hide();
        }.bind(this, file_name));
        file_row.append(file_entry);

        var file_delete = $('<div>');
        file_delete.append('x');
        file_delete.addClass('file_delete');
        file_delete.click(function(file_name, file_row) {
          fs.delete(file_name);
          file_row.remove();
        }.bind(this, file_name, file_row));
        file_row.append(file_delete);

        files.append(file_row);
      }
      files.append('<br/>');
      var cancel = $('#file_cancel');
      cancel.click(function() {
        file_dialog.hide();
      });
    });
  }

  var editor = new Editor();

});
