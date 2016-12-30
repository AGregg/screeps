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
      DefendRoom(room);
      ActivateSafeMode(room);

      for(let role of Roles()){
          if(CountCreepsWithRole(role.role) < role.min(room)) {
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
    min: function(room){ return 5; },
    idealSpawnCost: function(room){
      if (CountCreepsWithRole('harvester') < 2) room.energyAvailable;
      else return (room.energyCapacityAvailable + 250) / 2;
    },
    body: [WORK, CARRY, CARRY, MOVE],
    bodyAdd: [WORK, MOVE]
  };
  yield {
    role:'miner',
    min: function(room){ return Storages(room).length; },
    idealSpawnCost: function(room) { return CalculateBodyCost([WORK, WORK, WORK, WORK, WORK, MOVE]); },
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    bodyAdd: [MOVE]
  };
  yield {
    role:'upgrader',
    min: function(room){ return 2; },
    idealSpawnCost: function(room){ return (room.energyCapacityAvailable + 250) / 2; },
    body: [WORK, CARRY, CARRY, MOVE],
    bodyAdd: [WORK, MOVE]
  };
  yield {
    role:'builder',
    min: function(room){ return 1; },
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

    var newName = room.find(FIND_MY_SPAWNS)[0].createCreep(body, undefined, {role: role.role } );
    console.log('Spawning new ' + role + ': ' + newName);
}

function CalculateBodyCost(body){
  // var _ = require("lodash");
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

function Storages(room){
  return room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_STORAGE ||
                      structure.structureType == STRUCTURE_CONTAINER);
          }
  });
}

function ActivateSafeMode(room){
	var hostiles = room.find(FIND_HOSTILE_CREEPS);
  var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
  var spawn = room.find(FIND_MY_SPAWNS)[0];
	if (hostiles.length > 0 && (towers.length == 0 || spawn.hits < spawn.hitsMax) && room.controller.safeMode == undefined){
		room.controller.activateSafeMode();
    Game.notify('Safe mode activated!');
	}
}

function DefendRoom(room){
  var hostiles = room.find(FIND_HOSTILE_CREEPS);

  if(hostiles.length > 0) {
      var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
      towers.forEach(tower => tower.attack(tower.pos.findInRange(FIND_HOSTILE_CREEPS, 15)[0]));
  }
}
