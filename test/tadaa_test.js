var assert = require('assert'),
	npm = require('npm'),
	sinon = require('sinon'),
	tadaa = require('tadaa'),
	tadaarunner = require('../tadaa.js');

describe('tadaa-runner', function() {
	describe('start', function() {
		var install;
		var commands;

		beforeEach(function() {
			sinon.stub(tadaa, 'start');
			commands = npm.commands;
			install = sinon.stub();
			npm.commands = {
				install : install
			};
		});

		afterEach(function() {
			tadaa.start.restore();
			npm.commands = commands;
		})

		it('should call npm install for plugin', function(done) {
			install.yields();
			tadaarunner.start({ name: "tadaa-elb"}, function() {
				assert(install.calledOnce);
				assert.deepEqual(install.args[0][0], ["tadaa-elb"]);
				return done();
			})
		});

		it('should return error if npm install fails', function(done) {
			install.yields('ERROR');
			tadaarunner.start({ name: "tadaa-elb"}, function(e) {
				assert.equal(tadaa.start.callCount, 0);
				assert.equal(e, 'ERROR');
				return done();
			})
		});
	})
});