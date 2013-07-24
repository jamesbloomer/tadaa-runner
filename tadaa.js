var tadaa = require('tadaa'),
    fs = require("fs");

fs.readdirSync("./plugins").forEach(function(dir) {
  
  // Assume that only sensible things are in the plugins directory
  var plugin = require("./plugins/" + dir);
    
  tadaa.start(
      plugin.interval || 600000, 
      plugin.logic || [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}], 
      plugin.getValue, 
      plugin.options || {}, 
      plugin.player || 'aplay');
});