var _ = require('underscore'),
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	tadaa = require('tadaa');

var tadaarunner = {};

tadaarunner.run = function(done) {
	var config = tadaarunner._requireConfig("./config.js");
	async.each(_.values(config(tadaa)), tadaarunner._start, done);
};

tadaarunner._start = function(pluginConfig, cb) {	
	var plugin = tadaarunner._requirePlugin(pluginConfig.name);

	var defaultPluginLogic = [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}];
	var logic = pluginConfig.logic || plugin.logic || defaultPluginLogic;

	logic = tadaarunner._resolveLogic(pluginConfig.name, logic);

	tadaa.start(
		pluginConfig.interval || plugin.interval || 600000, 
		logic, 
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

tadaarunner._getSound = function(pluginName, sound) {
	if (fs.existsSync(sound)) {
		return sound;
	}

	var pluginPath = path.dirname(require.resolve(pluginName));
	var soundPath = path.join(pluginPath, 'sounds', sound);

	if (fs.existsSync(soundPath)) {
		return soundPath;
	} else {
		return path.join('./sounds', path.basename(sound));
	}
};

tadaarunner._resolveLogic = function(pluginName, logic) {
	_.each(logic, function(item) {
		item.sound = tadaarunner._getSound(pluginName, item.sound);
	});

	return logic;
};

module.exports = tadaarunner;