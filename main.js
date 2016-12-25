var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var modRoom = require('modRoom');

module.exports.loop = function () {
	ClearCreepMemory();

	for (var roomName in Game.rooms){
		//Game.rooms['E76S29']
		var room = Game.rooms[roomName]
			modRoom.run(room);
		}

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function SpawnWorker(roomName, role){
		//work 100 energy, ability to harvest, build, repair, dismantle, upgrade
		//move 50 energy, reduces fatigue by 2 points per tick
		//carry 50 energy, can carry 50 resources
		var energy = CountEnergy(roomName);
		var body = [WORK,CARRY,MOVE];
		energy = energy - 200;
		while (energy >= 150){
			body.push(WORK, MOVE);
			energy = energy - 150;
		}

    var newName = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0].createCreep(body, undefined, {role: role, caste: 'worker' } );
    console.log('Spawning new ' + role + ': ' + newName);
}

function CountCreepsWithRole(role){
    return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
}

function CountCreepsWithCaste(caste){
	return _.filter(Game.creeps, (creep) => creep.memory.caste == caste).length;
}

function ActivateSafeMode(roomName){
	if (Game.rooms[roomName] == undefined) return;
	var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
	if (hostiles.length > 0 && Game.rooms[roomName].controller.safeMode == undefined){
		Game.rooms[roomName].controller.activateSafeMode();
	}
}

function ClearCreepMemory(){
	for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
