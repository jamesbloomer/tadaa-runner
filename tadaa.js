var _ = require('underscore'),
	async = require('async'),
	tadaa = require('tadaa'),
    fs = require("fs"),
    npm = require("npm");

var tadaarunner = {};

tadaarunner.run = function() {
	npm.load({}, function (e) {
		if (e) {
			process.exit(1);
		}

	  	npm.on("log", function (message) {
	   		console.log(message);
		});

		loadPlugins(function(e) {
			if (e) {
				console.error(e);
			}

			return;
		});
	});
};


tadaarunner.loadPlugins = function(done) {
	var config = require("./config.json");
	async.each(_.values(config), start, done);
};

tadaarunner.start = function(pluginConfig, cb) {
	npm.commands.install([pluginConfig.name], function (e, data) {
		if (e) {
			return cb(e);
		}
		
		var plugin = require(pluginConfig.name);

		tadaa.start(
			pluginConfig.interval || plugin.interval || 600000, 
			pluginConfig.logic || plugin.logic || [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}], 
			plugin.getValue, 
			pluginConfig.options || plugin.options || {}, 
			pluginConfig.player || plugin.player || 'aplay'
		);

		return cb();
	});
};

module.exports = tadaarunner;