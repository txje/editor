
define({
  ButtonSet: function(parent) {
    var buttons = [];

    this.add = function(icon_class, callback) {
      var btn = $("<div>");
      btn.append("<div class='" + icon_class + "'></div>");
      btn.addClass("btn");
      btn.addClass("btn-default");
      parent.append(btn);
      buttons.push(btn);

      btn.click(function() {
        for(var b = 0; b < buttons.length; b++) {
          buttons[b].removeClass("active");
        }
        btn.addClass("active");
        callback();
      }.bind(this));
    }
  }
});
