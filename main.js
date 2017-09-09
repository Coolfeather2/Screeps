// import modules
require('prototype.spawn')();
var roleHarvester = require('role.Harvester');
var roleUpgrader = require('role.Upgrader');
var roleBuilder = require('role.Builder');
var roleRepairer = require('role.Repairer');
var roleWallRepairer = require('role.WallRepairer');
var roleLongDistanceHarvester = require('role.LongDistanceHarvester');

var screepsplus = require('screepsplus');

var home = 'W49S23'

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
    }

    //tower attack
    var towers = Game.rooms[home].find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER });
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
    var minimumNumberOfLongDistanceHarvesters = 1;
    
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'Builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'Repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'WallRepairer');
    var numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'LongDistanceHarvester');
    
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
        Game.spawns.Spawn1.createCustomCreep(energy, 'Upgrader');
    }
    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
         Game.spawns.Spawn1.createCustomCreep(energy, 'Repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        Game.spawns.Spawn1.createCustomCreep(energy, 'Builder');
    // if not enough Wallers
    } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        Game.spawns.Spawn1.createCustomCreep(energy, 'WallRepairer');
    }
    else if (numberOfLongDistanceHarvesters < minimumNumberOfLongDistanceHarvesters) {
        // try to spawn one
        Game.spawns.Spawn1.createLongDistanceHarvester(energy, 5, home, 'W48S23', 0);
    }   
    else {
    }

   screepsplus.collect_stats()
   Memory.stats.cpu.used = Game.cpu.getUsed();
};