
define({
  ButtonSet: function(parent) {
    var buttons = [];

    this.add = function(label, callback) {
      var btn = this.button(parent, label);
      buttons.push(btn);

      btn.click(function() {
        for(var b = 0; b < buttons.length; b++) {
          buttons[b].removeClass("active");
        }
        btn.addClass("active");
        callback();
      }.bind(this));
    }

    this.button = function(parent, label) {
      var btn = $("<div>");
      btn.append(label);
      btn.addClass("btn");
      btn.addClass("btn-default");
      parent.append(btn);
      return btn;
    }
  },
});
