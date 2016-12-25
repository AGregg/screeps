var cf = require('creepFunctions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
      cf.tryHarvest(creep);
      cf.tryBuild(creep);
      cf.tryStock(creep);      
      cf.tryUpgrade(creep);
	    cf.doJob(creep);
	}
};

module.exports = roleBuilder;
