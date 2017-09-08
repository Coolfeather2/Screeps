// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairers = require('role.wallRepairers');

var screepsplus = require('screepsplus');

module.exports.loop = function () {
    //clear memory
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    
    
    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'Harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'Upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'Builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'Repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'Waller') {
            roleWallRepairers.run(creep);
        }
    }

    //tower attack
    var towers = Game.rooms.W49S23.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER });
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    var minimumNumberOfHarvesters = 2;
    var minimumNumberOfUpgraders = 2;
    var minimumNumberOfBuilders = 2;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'Builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'Repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'WallRepairers');
    
    var name = undefined;
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;


    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, 'Harvester');
        }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Upgrader');
    }
    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'Builder');
    // if not enough Wallers
    } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'WallRepairers');
    }
    else {
    }

   screepsplus.collect_stats()
   Memory.stats.cpu.used = Game.cpu.getUsed();
};