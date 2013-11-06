/*
    ico.js
    https://github.com/txje/ico-js
    
    Copyright 2013, Jeremy Wang
*/

define(["./svgpath"], function(svgpath) {
  return { IconGenerator: function() {
    console.log("ico.js: generating icons...");
    
    var renderIcon = function(ico) {
        var mult = ico["retina"] ? 2 : 1;
        var can = document.createElement("canvas");
        // modified HTML attributes
        can.setAttribute('width', ico.width * mult);
        can.setAttribute('height', ico.height * mult);
        
        var ctx = can.getContext("2d");
        ctx.lineWidth = 0;
        for(var command in ico) {
            if(command == "lineWidth") {
                ctx.lineWidth = ico["lineWidth"] * mult;
            }
            else if(command == "lineColor") {
                ctx.strokeStyle = ico["lineColor"];
            }
            else if(command == "fillColor") {
                ctx.fillStyle = ico["fillColor"];
            }
            else if(command == "path") {
                var svg = ico["path"]["svg"];
                var original_width = ico["path"]["width"];
                var original_height = ico["path"]["height"];
                // do not skew image if dimensions don't agree
                var scale = Math.min(ico.width/original_width*mult, ico.height/original_height*mult);
                var sp = new svgpath.svgpath(svg, scale);
                sp.draw(ctx);
            }
        }
        if(ico["fillColor"])
            ctx.fill();
        if(ico["lineColor"] && ctx.lineWidth > 0)
            ctx.stroke();
        
        return can.toDataURL();
    }
    
    var icons = {}; // name -> commands, list of icons
    var scripts = document.getElementsByTagName('script');
    for(var s = 0; s < scripts.length; s++) {
        if(scripts[s].getAttribute("type") == "x-icon") {
            var name = scripts[s].getAttribute("name");
            try {
                var newIcon = JSON.parse(scripts[s].textContent);
            } catch(e) {
                throw new Error("ico.js: Error parsing '" + name + "' icon script (" + e.name + ": " + e.message + ")");
            }
            if(icons[name]) {
                console.log("Icon '" + name + "' redefined, using first definition");
            }
            else {
                icons[name] = [renderIcon(newIcon), newIcon["width"], newIcon["height"]];
            }
        }
    }
    if(!document.styleSheets || document.styleSheets.length == 0) {
        throw new Error("ico.js: No stylesheet to attach icons, create a stylesheet.");
    }
    var ss = document.styleSheets[0]; // get first stylesheet
    for(var i in icons) {
        ss.insertRule(".icon-" + i + " { width: " + icons[i][1] + "px; height: " + icons[i][2] + "px; background:url('" + icons[i][0] + "');" + (newIcon["retina"] ? " background-size: " + icons[i][1] + "px " + icons[i][2] + "px;" : "") + " background-repeat: none; display:inline-block; }", 0);
    }
  }}
});
