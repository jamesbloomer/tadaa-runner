var assert = require('assert'),
	path = require('path'),
	sinon = require('sinon'),
	tadaa = require('tadaa'),
	tadaarunner = require('../tadaarunner.js');

describe('tadaa-runner', function() {
	describe('_start', function() {
		var commands, mockplugin, getSound;

		beforeEach(function() {
			sinon.stub(tadaa, 'start');
			getSound = sinon.stub(tadaarunner, '_getSound');

			mockplugin = { 
				name: "MOCK",
				interval: 42, 
				logic: [{fn: "FUNCTION1", sound: "SOUND1"}, {fn: "FUNCTION2", sound: "SOUND2"}], 
				otherGetValue: function(){ return 123456789; }, 
				getValue: function(){ return 987654321; }, 
				options: { A: "AA", B: "BB"}, 
				player: 'anotherplayer'
			};

			sinon.stub(tadaarunner, '_requirePlugin').returns(mockplugin);

		});

		afterEach(function() {
			tadaa.start.restore();
			tadaarunner._requirePlugin.restore();
			tadaarunner._getSound.restore();
		});

		it('should require the plugin module', function(done) {
			tadaarunner._start({ name: "TEST"}, function() {
				assert(tadaarunner._requirePlugin.calledOnce);
				return done();
			});
		});

		it('should call tadaa.start with config values if they exist', function(done) {
			getSound.withArgs('TEST', 'SND1').returns('./sounds/SND1');
			getSound.withArgs('TEST', 'SND2').returns('./sounds/SND2');
			tadaarunner._start({ 
				name: "TEST", 
				interval: 24, 
				logic: [{fn : "FN1", sound: "SND1"}, {fn: "FN2", sound: "SND2"}],
				valueFn: "otherGetValue",
				options: {A : "B", C: "D"},
				player: "aplayer"
			}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 24);
				assert.deepEqual(tadaa.start.args[0][1], [{fn : "FN1", sound: "./sounds/SND1"}, {fn: "FN2", sound: "./sounds/SND2"}]);
				assert.equal(tadaa.start.args[0][2], mockplugin.otherGetValue);
				assert.deepEqual(tadaa.start.args[0][3], {A : "B", C: "D"});
				assert.equal(tadaa.start.args[0][4], 'aplayer');
				return done();
			});
		});

		it('should call tadaa.start with plugin values if config values do not exist', function(done) {
			getSound.withArgs('MOCK', 'SOUND1').returns('./sounds/SOUND1');
			getSound.withArgs('MOCK', 'SOUND2').returns('./sounds/SOUND2');
			tadaarunner._start({name: "MOCK"}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 42);
				assert.deepEqual(tadaa.start.args[0][1], [{fn: "FUNCTION1", sound: "./sounds/SOUND1"}, {fn: "FUNCTION2", sound: "./sounds/SOUND2"}]);
				assert.equal(tadaa.start.args[0][2](), 987654321);
				assert.deepEqual(tadaa.start.args[0][3], {A: "AA", B: "BB"});
				assert.equal(tadaa.start.args[0][4], 'anotherplayer');
				return done();
			});
		});

		it('should call tadaa.start with default values if config and plugin values do not exist', function(done) {
			getSound.withArgs('TEST', 'up.wav').returns('./sounds/up.wav');
			getSound.withArgs('TEST', 'down.wav').returns('./sounds/down.wav');
			tadaarunner._requirePlugin.returns({});
			tadaarunner._start({name: "TEST"}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 600000);
				assert.deepEqual(tadaa.start.args[0][1], [{fn: tadaa.up, sound:"./sounds/up.wav"}, {fn: tadaa.down, sound:"./sounds/down.wav"}]);
				assert.deepEqual(tadaa.start.args[0][3], {});
				assert.equal(tadaa.start.args[0][4], "aplay");
				return done();
			});
		});

		it('should call getSound for each sound in plugin logic', function(done) {
			tadaarunner._start({}, function() {
				assert(tadaarunner._getSound.calledTwice); 
				return done();
			});			
		});
	});

	describe('run', function() {
		beforeEach(function() {
			sinon.stub(tadaarunner, '_start').yields();
			sinon.stub(tadaarunner, '_requireConfig').returns(function(tadaa) {return {1 : "1", 2: "2"};});
		});

		afterEach(function() {
			tadaarunner._start.restore();
			tadaarunner._requireConfig.restore();
		});

		it('should call start for each plugin in config', function(done) {
			tadaarunner.run(function() {
				assert(tadaarunner._start.calledTwice);
				assert.equal(tadaarunner._start.args[0][0], '1');
				assert.equal(tadaarunner._start.args[1][0], '2');
				return done();
			});
		});
	});

	describe('_getSound', function() {
		it('should return sound from module if it exists', function() {
			var soundPath = tadaarunner._getSound('tadaa-example', 'up.wav');
			var currentModulePath = path.dirname(require.resolve('../tadaarunner.js'));
			soundPath = soundPath.replace(currentModulePath + '/', '');
			assert.equal(soundPath, 'node_modules/tadaa-example/sounds/up.wav');
			return;
		});

		it('should return default sound if module lacks requested', function() {
			assert.equal(tadaarunner._getSound('tadaa-example', '/x/y/xdown.wav'), 'sounds/xdown.wav');
			return;
		});
	});

	describe('_resolveLogic', function() {
		it('should resolve sound paths', function() {
			var example = path.dirname(require.resolve('tadaa-example'));
			var resolved = tadaarunner._resolveLogic('tadaa-example', [{fn: 'FUNCTION', sound: "up.wav"}]);
			assert.deepEqual(resolved, [{fn: 'FUNCTION', sound: path.join(example, 'sounds', 'up.wav')}]);
		});
	});
});
