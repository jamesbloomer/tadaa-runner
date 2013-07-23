var tadaa = require('tadaa');

var config = {};

// The minimum that you need to implement is the getValue function which gets
// the value that tadaa is going to monitor. Alternatively require a module
// that implements the function.
config.getValue = function(options, callback){
    var number = Math.random() * options.multipler;
    
    // Plugins are encouraged to log any information that may be useful
    console.log("exampleplugin got the number " + number);
    
    callback(null, number); 
};

// The function above utilises the options that are defined here
// Typically these will be configuration variables such as passwords
// and are expected to be edited per deployment or read from environment variables
config.options = {
    multiplier: 100
};

// From here on the plugin implementation is optional as defaults exist for these values.

// Polling interval in milliseconds. Default 10 minutes.
config.interval = 60000;

// Logic and sounds. Default is to check for simple up and down and play "up.wav" and "down.wav"
// The example here swaps in some custom logic by using fndown
config.logic = [{fn: tadaa.up, sound:"up.ogg"}, {fn: fndown, sound:"down.ogg"}];

var fndown = function(currentValue, newValue) {
    return newValue > currentValue;  
};

// Which audio player to use. The default is aplay.
config.player = 'ogg123';


module.exports = config;