var cf = require('creepFunctions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
      cf.tryHarvest(creep);
      cf.tryStock(creep);
      cf.tryBuild(creep);
      cf.tryUpgrade(creep);
	    cf.doJob(creep);
	}
};

module.exports = roleHarvester;
