var _ = require('underscore'),
	async = require('async'),
	tadaa = require('tadaa'),
    fs = require("fs"),
    npm = require("npm");

var tadaarunner = {};

tadaarunner.run = function(done) {
	npm.load({}, function (e) {
		if (e) {
			return done(e);
		}

		npm.on("log", function (message) {
			console.log(message);
		});

		tadaarunner._loadPlugins(function(e) {
			if (e) {
				return done(e);
			}

			return done();
		});
	});
};

tadaarunner._loadPlugins = function(done) {
	var config = tadaarunner._requireConfig("./config.json");
	async.each(_.values(config), tadaarunner._start, done);
};

tadaarunner._start = function(pluginConfig, cb) {
	npm.commands.install([pluginConfig.name], function (e, data) {
		if (e) {
			return cb(e);
		}
		
		var plugin = tadaarunner._requirePlugin(pluginConfig.name);

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

tadaarunner._requireConfig = function(path) {
	return require(path);
};

tadaarunner._requirePlugin = function(name) {
	return require(name);
};

module.exports = tadaarunner;