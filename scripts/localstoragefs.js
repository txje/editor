/*
 * the_editor/LocalStorageFS
 *
 * A filesystem manager based on LocalStorage
 */

define({
  LocalStorageFS: function(namespace) {

    this.save = function(filename, data) {
      if(typeof data != typeof "string") {
        data = JSON.stringify(data);
      }
      localStorage.setItem(namespace + "." + filename, data);
      return true;
    }

    this.open = function(path) {
      if(path == null) path = "";
      path = namespace + "." + path;
      var files = [];
      for(key in localStorage) {
        if(key.substring(0, path.length) == path) {
          files.push(key.substr(namespace.length + 1));
        }
      }
      return files;
    }

    this.load = function(filename) {
      var data = localStorage.getItem(namespace + "." + filename);
      try {
        data = JSON.parse(data);
      } catch (e) {
        // do nothing
      }
      return data;
    }

    this.delete = function(filename) {
      delete localStorage[namespace + "." + filename];
      return true; // for localStorage, we'll assume it succeeded
    }

  }
});
