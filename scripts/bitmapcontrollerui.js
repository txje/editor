/*
 * editor/BitmapControllerUI
 *
 * This module creates and controls the bitmap interactions
 */

define(["../incl/ico.js/ico", "button_set"], function(ico, button_set){
  return { BitmapControllerUI: function(bitmapUI, parent) {

    // ----------------------------------
    // Zoom
    // ----------------------------------
    var zoom_control = $("<div>");
    var zoom_less = $("<div>");
    zoom_less.addClass("icon-zoom-out");
    zoom_less.addClass("btn");
    zoom_less.addClass("btn-default");
    zoom_less.css("margin-right", "15px");
    var zoom_more = $("<div>");
    zoom_more.addClass("icon-zoom-in");
    zoom_more.addClass("btn");
    zoom_more.addClass("btn-default");
    zoom_more.css("margin-left", "15px");
    var zoom_value = $("<span>");
    var current_zoom = 1;
    do_zoom(16);
    zoom_control.append(zoom_less);
    zoom_control.append(zoom_value);
    zoom_control.append('x');
    zoom_control.append(zoom_more);
    zoom_control.append("<br/><br/>");
    parent.append(zoom_control);

    zoom_less.click(function() {
      do_zoom(0.5);
    }.bind(this))

    zoom_more.click(function() {
      do_zoom(2);
    }.bind(this))

    function do_zoom(multiplier) {
      current_zoom = Math.ceil(current_zoom * multiplier);
      zoom_value.text(current_zoom);
      bitmapUI.zoom(current_zoom);
    }

    // ----------------------------------
    // Color
    // ----------------------------------

    function make_spectrum_chooser(parent, onchange) {
      var chooser = $("<input type='text'/>");
      var spectrum_params = {
        showAlpha: true,
        showPalette: true,
        localStorageKey: "editor.spectrum", // palette stored locally
        color: 'rgba(' + chosen_color.join(',') + ')',
        showButtons: false
      };
      if(onchange != null) {
        spectrum_params["change"] = function(color) {
          var color = color.toRgb();
          chosen_color = [color['r'], color['g'], color['b'], color['a']];
          onchange(chosen_color);
        }.bind(this);
      }
      parent.append(chooser);
      chooser.spectrum(spectrum_params);
      return chooser;
    }

    var chosen_color = [0,0,0,255];
    var color_chooser = make_spectrum_chooser(parent, function(color) {
      bitmapUI.set_color(chosen_color);
    });
    color_chooser.css("padding", "10px");

    // ----------------------------------
    // Mode (draw/erase)
    // ----------------------------------
    parent.append("<br/><br/>");
    var buttons = new button_set.ButtonSet(parent);
    buttons.add('icon-draw', function() {
      bitmapUI.set_color(chosen_color);
      bitmapUI.set_click('draw');
    });
    buttons.add('icon-erase', function() {
      bitmapUI.set_color([0,0,0,0]);
      bitmapUI.set_click('draw');
    });
    parent.append("<br/>");

    // ----------------------------------
    // Mode (color-select/dropper)
    // ----------------------------------

    buttons.add('icon-dropper', function() {
      bitmapUI.set_click('pick', function(color) {
        set_color(color);
        $('.icon-draw').click();
      });
    });

    function set_color(color) {
      var color_string = 'rgba(' + color.join(',') + ')';
      color_chooser.spectrum("set", color_string);
    }

    // ----------------------------------
    // Mode (fill)
    // ----------------------------------

    buttons.add('icon-bucket', function() {
      bitmapUI.set_click('pour');
    });

    // ----------------------------------
    // Mode (color swap)
    // ----------------------------------

    parent.append("<br/><br/>");
    var from_color = make_spectrum_chooser(parent);
    var color_swap = buttons.icon_button(parent, 'icon-swap');
    color_swap.css("margin", "10px");
    var to_color = make_spectrum_chooser(parent);
    color_swap.click(function() {
    });


    // run the ico.js generator
    ico.IconGenerator();

  }}
});
