var tadaa = require('tadaa'),
    fs = require("fs"),
    npm = require("npm");

npm.load({}, function (er) {
	if (er) {
		process.exit(1);
	}

  	npm.on("log", function (message) {
   		console.log(message);
	});

	readPluginsFromFile(function(er) {
		if (er) {
			console.error(er);
		}

		return;
	});

	return;
});

var readPluginsFromDirectory = function() {
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
};

var readPluginsFromFile = function(done) {
	var config = require("./config.json");

	for (pluginInstance in config) {
		var pluginConfig = config[pluginInstance];
		
		npm.commands.install([pluginConfig.name], function (er, data) {
    		if (er) {
    			return done(er);
    		}

    		// TODO what's in data?
			
			var plugin = require(pluginConfig.name);

			tadaa.start(
				pluginConfig.interval || plugin.interval || 600000, 
				pluginConfig.logic || plugin.logic || [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}], 
				plugin.getValue, 
				pluginConfig.options || plugin.options || {}, 
				pluginConfig.player || plugin.player || 'aplay'
			);

			return done();
		});
	}
};