var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner')
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
				if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
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
