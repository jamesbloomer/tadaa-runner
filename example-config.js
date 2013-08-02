module.exports = function(tadaa) {

	return {
		"first example plugin instance" : {
			"interval": 2000,
			"name" : "tadaa-example", 
			"options" : {
				"message" : "first",
				"multiplier" : 100
			}
		},
		"second example plugin instance" : {
			"interval": 3000,
			"name" : "tadaa-example",
			"valueFn": "otherGetValue", 
			"options" : {
				"message" : "second",
				"multiplier" : 10
			}
		},
	};
};