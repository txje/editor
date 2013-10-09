/*
 * the_editor/LocalStorageFS
 *
 * A filesystem manager based on LocalStorage
 */

$(function() {
  function LocalStorageFS(namespace) {

    this.save = function(filename, data) {
      localStorage.setItem(namespace + "." + filename, data);
    }

    this.open = function(path) {
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
      return localStorage.getItem(namespace + "." + filename)
    }
  }
}
