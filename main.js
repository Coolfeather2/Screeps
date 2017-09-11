//Command to spawn claimer: Game.spawns.Spawn1.memory.claimRoom = '<roomname>'

// import modules
require('prototype.spawn')();

var Traveler = require('traveler');
var roleHarvester = require('role.Harvester');
var roleUpgrader = require('role.Upgrader');
var roleBuilder = require('role.Builder');
var roleRepairer = require('role.Repairer');
var roleWallRepairer = require('role.WallRepairer');
var roleLongDistanceHarvester = require('role.LongDistanceHarvester');
var roleClaimer = require('role.Claimer');

var screepsplus = require('stats.screepsplus');

global.home = 'W49S23'

module.exports.loop = function () {
    //clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    
    
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'Harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'Upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'Builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'Repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'WallRepairer') {
            roleWallRepairer.run(creep);
        }
        else if (creep.memory.role == 'LongDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
        else if (creep.memory.role == 'Claimer') {
            roleClaimer.run(creep);
        }
    }

    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER );
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    var minimumNumberOfHarvesters = 1;
    var minimumNumberOfUpgraders = 2;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfLongDistanceHarvesters = 3;

    var creepsByRole = _.countBy(Game.creeps, 'memory.role');
    var numberOfHarvesters = creepsByRole['Harvester'] || 0;
    var numberOfUpgraders = creepsByRole['Upgrader'] || 0;
    var numberOfBuilders = creepsByRole['Builder'] || 0;
    var numberOfRepairers = creepsByRole['Repairer'] || 0;
    var numberOfWallRepairers = creepsByRole['WallRepairer'] || 0;
    var numberOfLongDistanceHarvesters = creepsByRole['LongDistanceHarvester'] || 0;
   
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name;

    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Harvester');
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'Harvester');
        }
    }
    else if (Game.spawns.Spawn1.memory.claimRoom != undefined) {
        name = Game.spawns.Spawn1.createClaimer(Game.spawns.Spawn1.memory.claimRoom);
        if (!(name < 0)) {
            delete Game.spawns.Spawn1.memory.claimRoom;
        }
    }
    else if (numberOfLongDistanceHarvesters < minimumNumberOfLongDistanceHarvesters) {
        name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, home, 'W48S23', 0);
    } 
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Upgrader');
    }
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Repairer');
    }
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Builder');
    } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'WallRepairer');
    }
    else {
        name = -1
    }

/**
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawn[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS)

        var energy = spawn.room.energyCapacityAvailable;
        var name;

        var creepsByRole = _.countBy(creepsInRoom, 'memory.role');
        var numberOfHarvesters = creepsByRole['Harvester'] || 0;
        var numberOfMiners = creepsByRole['Miner'] || 0;
        var numberOfTransferrers = creepsByRole['Transferrer'] || 0;
        var numberOfUpgraders = creepsByRole['Upgrader'] || 0;
        var numberOfBuilders = creepsByRole['Builder'] || 0;
        var numberOfRepairers = creepsByRole['Repairer'] || 0;
        var numberOfWallRepairers = creepsByRole['WallRepairer'] || 0;
        var numberOfLongDistanceHarvesters = creepsByRole['LongDistanceHarvester'] || 0;

        for (let source of spawn.room.find(FIND_SOURCES)) {
            if (!_.some(creepsInRoom, c => c.memory.role == 'Miner' && c.memory.sourceID == source.id)) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                if (containers.length > 0) {
                    name = spawn.createMiner(energy, source.id);
                    break;
                }
            }
        }
        if (name == undefined) {
            if (numberOfHarvesters < spawns.memory.minHarvesters) {
                name = spawn.createCustomCreep(energy, 'Harvester');

                // if spawning failed and we have no harvesters left
                if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
                    name = spawn.createCustomCreep(spawn.room.energyAvailable, 'Harvester');
                }
            }
            else if (spawn.memory.claimRoom != undefined) {
                name = spawn.createClaimer(spawn.memory.claimRoom);
                if (!(name < 0)) {
                    delete spawn.memory.claimRoom;
                }
            }
            else if (numberOfLongDistanceHarvesters < spawn.memory.LongHarvesters.min) {
                name = spawn.createLongDistanceHarvester(energy, 5, spawn.room.name, spawn.memory.LongHarvesters.target, 0);
            }
            else if (numberOfUpgraders < spawn.memory.minUpgraders) {
                name = spawn.createCustomCreep(energy, 'Upgrader');
            }
            else if (numberOfRepairers < spawn.memory.minRepairers) {
                name = spawn.createCustomCreep(energy, 'Repairer');
            }
            else if (numberOfBuilders < spawn.memory.minBuilders) {
                name = spawn.createCustomCreep(energy, 'Builder');
            } else if (numberOfWallRepairers < spawn.memory.minWallRepairers) {
                name = spawn.createCustomCreep(energy, 'WallRepairer');
            }
            else {
            }
        }
    }
**/

    if (!(name<0)){
        var creepsByRole = _.countBy(Game.creeps, 'memory.role');
        var numberOfHarvesters = creepsByRole['Harvester'] || 0;
        var numberOfUpgraders = creepsByRole['Upgrader'] || 0;
        var numberOfBuilders = creepsByRole['Builder'] || 0;
        var numberOfRepairers = creepsByRole['Repairer'] || 0;
        var numberOfWallRepairers = creepsByRole['WallRepairer'] || 0;
        var numberOfLongDistanceHarvesters = creepsByRole['LongDistanceHarvester'] || 0;

        console.log('----------------------------------------');
        console.log(/**spawnName +**/" spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
        console.log("Harvesters    : " + numberOfHarvesters + "/" + minimumNumberOfHarvesters);
        console.log("Upgraders     : " + numberOfUpgraders + "/" + minimumNumberOfUpgraders);
        console.log("Builders      : " + numberOfBuilders + "/" + minimumNumberOfBuilders);
        console.log("Repairers     : " + numberOfRepairers + "/" + minimumNumberOfHarvesters);
        console.log("WallRepairers : " + numberOfWallRepairers + "/" + minimumNumberOfRepairers);
        console.log("Long Harvester: " + numberOfLongDistanceHarvesters + "/" + minimumNumberOfLongDistanceHarvesters);
        console.log('----------------------------------------');
    }

    screepsplus.collect_stats()
    Memory.stats.cpu.used = Game.cpu.getUsed();
};