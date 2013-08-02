var _ = require('underscore'),
	async = require('async'),
	tadaa = require('tadaa');

var tadaarunner = {};

tadaarunner.run = function(done) {
	var config = tadaarunner._requireConfig("./config.js");
	async.each(_.values(config(tadaarunner)), tadaarunner._start, done);
};

tadaarunner._start = function(pluginConfig, cb) {	
	var plugin = tadaarunner._requirePlugin(pluginConfig.name);

	tadaa.start(
		pluginConfig.interval || plugin.interval || 600000, 
		pluginConfig.logic || plugin.logic || [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}], 
		plugin[pluginConfig.valueFn] || plugin.getValue, 
		pluginConfig.options || plugin.options || {}, 
		pluginConfig.player || plugin.player || 'aplay'
	);

	return cb();
};

tadaarunner._requireConfig = function(path) {
	return require(path);
};

tadaarunner._requirePlugin = function(name) {
	return require(name);
};

module.exports = tadaarunner;