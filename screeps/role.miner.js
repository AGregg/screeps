var cf = require('creepFunctions');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
      cf.mine(creep);
	}
};

module.exports = roleMiner;
