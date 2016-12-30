/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('modRoom');
 * mod.thing == 'a thing'; // true
 */

var modRoom = {

    /** @param {Creep} creep **/
    run: function(room) {
      ActivateSafeMode(room);

      for(let role of Roles()){
          if(CountCreepsWithRole(role.role) < role.min) {
  	        SpawnWorker(room, role);
            break;
          }
  		}
	}
};

module.exports = modRoom;

function* Roles(){
  //order here determines spawning priority
  yield {
    role:'harvester',
    caste:'worker',
    min:5,
    idealSpawnCost: function(room){
      if (CountCreepsWithRole('harvester') < 2) room.energyAvailable;
      else return (room.energyCapacityAvailable + 250) / 2;
    },
    body: [WORK, CARRY, CARRY, MOVE],
    bodyAdd: [WORK, MOVE]
  };
  yield {
    role:'upgrader',
    caste:'worker',
    min:2,
    idealSpawnCost: function(room){ return (room.energyCapacityAvailable + 250) / 2; },    
    body: [WORK, CARRY, CARRY, MOVE],
    bodyAdd: [WORK, MOVE]
  };
  yield {
    role:'builder',
    caste:'worker',
    min:1,
    idealSpawnCost: function(room){ return (room.energyCapacityAvailable + 250) / 2; },
    body: [WORK, CARRY, CARRY, MOVE],
    bodyAdd: [WORK, MOVE]
  };
}

function SpawnWorker(room, role){
    var energyAvailable = room.EnergyAvailable;
		var idealSpawnCost = role.idealSpawnCost(room);
    if (energyAvailable < idealSpawnCost) return;
    var body = role.body;
    var bodyAdd = role.bodyAdd;
    var spawnCost = CalculateBodyCost(body);
    var bodyAddCost = CalculateBodyCost(bodyAdd);

		while (spawnCost + bodyAddCost < idealSpawnCost){
			Array.prototype.push.apply(body, bodyAdd);
      spawnCost += bodyAddCost;
		}

    var newName = room.find(FIND_MY_SPAWNS)[0].createCreep(body, undefined, {role: role.role, caste: 'worker' } );
    console.log('Spawning new ' + role + ': ' + newName);
}

function CalculateBodyCost(body){
  var _ = require("lodash");
  var bodyCost = {
    "move": 50,
    "work": 100,
    "carry": 50,
    "attack": 80,
    "ranged_attack": 150,
    "heal": 250,
    "claim": 600,
    "tough": 10
  };
  var cost = 0;
  _.forEach(body, function(part) { cost += bodyCost[part]; });
  return cost;
}

function CountCreepsWithRole(role){
    return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
}

function CountCreepsWithCaste(caste){
	return _.filter(Game.creeps, (creep) => creep.memory.caste == caste).length;
}

function ActivateSafeMode(room){
	var hostiles = room.find(FIND_HOSTILE_CREEPS);
	if (hostiles.length > 0 && room.controller.safeMode == undefined){
		room.controller.activateSafeMode();
    Game.notify('Safe mode activated!  Hostiles detected!' + JSON.stringify(hostiles));
	}
}


// var tower = Game.getObjectById('5586a08254d9045c17ddf50b');
// if(tower) {
    // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        // filter: (structure) => structure.hits < structure.hitsMax
    // });
    // if(closestDamagedStructure) {
        // tower.repair(closestDamagedStructure);
    // }

    // var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // if(closestHostile) {
        // tower.attack(closestHostile);
    // }
// }
