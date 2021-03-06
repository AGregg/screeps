/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepFunctions');
 * mod.thing == 'a thing'; // true
 */



exports.doJob = function(creep){
  switch(creep.memory.job){
    case 'harvest':
      exports.harvest(creep);
      break;
    case 'stock':
      exports.stock(creep);
      break;
    case 'build':
      exports.build(creep);
      break;
    case 'upgrade':
      exports.upgrade(creep);
      break;
    case 'repair':
      exports.repair(creep);
      break;
  }
}

 exports.harvest = function(creep){
  var storage = closestNonEmptyStorage(creep);
  if (storage != null){
    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	     creep.moveTo(storage);
     }
  }
  else {
    var source = closestNonEmptySource(creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    }
 }

exports.stock = function(creep){
  var target = closestStockableStructure(creep);
  if(target != null) {
      if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }
  } else {
    creep.memory.job = 'harvest';
  }
}

exports.build = function(creep){
  var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target != null) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
      creep.memory.job = 'harvest';
    }
}

exports.upgrade = function(creep){
  if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
  }
}

exports.repair = function(creep){
  var target = Game.getObjectById(creep.memory.target);
  if (target == null || target.hits == target.hitsMax){
    target = closestDamagedStructure(creep);
    if (target == null){
      creep.memory.job = 'harvest';
      return;
    }
  }
  if (creep.repair(target) == ERR_NOT_IN_RANGE){
    creep.moveTo(target);
  }
}

exports.mine = function(creep){
  if (creep.memory.storage == null) creep.memory.storage = assignStorage(creep);
  storage = Game.getObjectById(creep.memory.storage);
  creep.moveTo(storage);
  creep.harvest(closestNonEmptySource(creep));
}

exports.tryHarvest = function(creep){
  if(!(creep.memory.job == 'harvest') && creep.carry.energy == 0) {
        creep.memory.job = 'harvest';
        creep.say('harvesting');
  }
}

exports.tryStock = function(creep){
  if (!(creep.memory.job == 'harvest' && creep.carry.energy == creep.carryCapacity)) return;
  if (findStockableStructures(creep).length > 0){
    creep.memory.job = 'stock';
    creep.say('Stocking');
  }
}

exports.tryBuild = function(creep){
  if (!(creep.memory.job == 'harvest' && creep.carry.energy == creep.carryCapacity)) return;
  if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0){
    creep.memory.job = 'build';
    creep.say('Building');
  }
}

exports.tryUpgrade = function(creep){
  if (!(creep.memory.job == 'harvest' && creep.carry.energy == creep.carryCapacity)) return;
  creep.memory.job = 'upgrade';
  creep.say('Upgrading');
}

exports.tryRepair = function(creep){
  if (!(creep.memory.job == 'harvest' && creep.carry.energy == creep.carryCapacity)) return;
  if (findDamagedStructures(creep).length > 0){
    creep.memory.job = 'repair';
    creep.memory.target = findDamagedStructures(creep)[0].id
    creep.say('Repairing');
  }
}

function findStockableStructures(creep){
  return creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION ||
                      structure.structureType == STRUCTURE_SPAWN ||
                      structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
  });
}

function closestStockableStructure(creep){
  return creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION ||
                      structure.structureType == STRUCTURE_SPAWN ||
                      structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
  });
}

function closestDamagedStructure(creep){
  return creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
  });
}

function closestNonEmptySource(creep){
  return creep.pos.findClosestByPath(FIND_SOURCES, {
          filter: (src) => {
              return (src.energy > 0 || src.ticksToRegeneration < 75); }
          });
}

function closestNonEmptyStorage(creep){
  return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER) && structure.energy > 0;
        }
  })
}

function findDamagedStructures(creep){
  return creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.hits < (structure.hitsMax / 3));
          }
  });
}

function assignStorage(creep){
  // var _ = require("lodash");
  var claimedStorages = _.map(_.map(creep.room.find(FIND_MY_CREEPS), 'memory'), 'storage');
  return creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_STORAGE ||
                      structure.structureType == STRUCTURE_CONTAINER) && [claimedStorages].indexOf(structure.id) == -1;
          }
  })[0].id;
}
