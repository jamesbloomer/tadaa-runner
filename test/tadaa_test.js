var assert = require('assert'),
	sinon = require('sinon'),
	tadaa = require('tadaa'),
	tadaarunner = require('../tadaarunner.js');

describe('tadaa-runner', function() {
	describe('_start', function() {
		var install, commands, mockplugin;

		beforeEach(function() {
			sinon.stub(tadaa, 'start');

			mockplugin = { 
				interval: 42, 
				logic: [{11: "22"}, {33: "44"}], 
				otherGetValue: function(){ return 123456789; }, 
				getValue: function(){ return 987654321; }, 
				options: { A: "AA", B: "BB"}, 
				player: 'anotherplayer'
			};

			sinon.stub(tadaarunner, '_requirePlugin').returns(mockplugin);

			install = sinon.stub();
		});

		afterEach(function() {
			tadaa.start.restore();
			tadaarunner._requirePlugin.restore();
		});

		it('should require the plugin module', function(done) {
			install.yields();
			tadaarunner._start({ name: "TEST"}, function() {
				assert(tadaarunner._requirePlugin.calledOnce);
				return done();
			});
		});

		it('should call tadaa.start with config values if they exist', function(done) {
			install.yields();
			tadaarunner._start({ 
				name: "TEST", 
				interval: 24, 
				logic: [{1 : "2"}, {3: "4"}],
				valueFn: "otherGetValue",
				options: {A : "B", C: "D"},
				player: "aplayer"
			}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 24);
				assert.deepEqual(tadaa.start.args[0][1], [{1 : "2"}, {3: "4"}]);
				assert.equal(tadaa.start.args[0][2], mockplugin.otherGetValue);
				assert.deepEqual(tadaa.start.args[0][3], {A : "B", C: "D"});
				assert.equal(tadaa.start.args[0][4], 'aplayer');
				return done();
			});
		});

		it('should call tadaa.start with plugin values if config values do not exist', function(done) {
			install.yields();
			tadaarunner._start({}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 42);
				assert.deepEqual(tadaa.start.args[0][1], [{11: "22"}, {33: "44"}]);
				assert.equal(tadaa.start.args[0][2](), 987654321);
				assert.deepEqual(tadaa.start.args[0][3], {A: "AA", B: "BB"});
				assert.equal(tadaa.start.args[0][4], 'anotherplayer');
				return done();
			});
		});

		it('should call tadaa.start with default values if config and plugin values do not exist', function(done) {
			install.yields();
			tadaarunner._requirePlugin.returns({});
			tadaarunner._start({}, function() {
				assert(tadaa.start.calledOnce);
				assert.equal(tadaa.start.args[0][0], 600000);
				assert.deepEqual(tadaa.start.args[0][1], [{fn: tadaa.up, sound:"up.wav"}, {fn: tadaa.down, sound:"down.wav"}]);
				assert.deepEqual(tadaa.start.args[0][3], {});
				assert.equal(tadaa.start.args[0][4], "aplay");
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
});
