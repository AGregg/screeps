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

  		//creep types
  		var harvester = { role:'harvester', caste:'worker', min:5 };
  		var upgrader = { role:'upgrader', caste:'worker', min:2 };
  		var builder = { role:'builder', caste:'worker', min:1 };

  		var roles = [harvester, upgrader, builder];

      for(var i in roles){
          var role = roles[i];
          if(CountCreepsWithRole(role.role) < role.min) {
  	        SpawnWorker(room, role.role);
          }
  			}
	}
};

module.exports = modRoom;

function SpawnWorker(room, role){
		//work 100 energy, ability to harvest, build, repair, dismantle, upgrade
		//move 50 energy, reduces fatigue by 2 points per tick
		//carry 50 energy, can carry 50 resources
		var energy = room.energyAvailable;
		var body = [WORK,CARRY,MOVE];
		energy = energy - 200;
		while (energy >= 150){
			body.push(WORK, MOVE);
			energy = energy - 150;
		}

    var newName = room.find(FIND_MY_SPAWNS)[0].createCreep(body, undefined, {role: role, caste: 'worker' } );
    console.log('Spawning new ' + role + ': ' + newName);
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
