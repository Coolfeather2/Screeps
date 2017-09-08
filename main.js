// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

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
    }

    var minimumNumberOfHarvesters = 2;
    var minumumNumberOfUpgraders = 5;
    var minumumNumberOfBuilders = 5;
    var minumumNumberOfRepairer = 2;
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'Builder');
    var numberOfRepairer = _.sum(Game.creeps, (c) => c.memory.role == 'Repairer');
    var name = undefined;

    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'Harvester', working: false });
    }
    else if (numberOfUpgraders < minumumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'Upgrader', working: false });
    }
    else if (numberOfRepairer < minumumNumberOfRepairer) {
        name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'Repairer', working: false });
    }
    else if (numberOfBuilders < minumumNumberOfBuilders) {
        name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'Builder', working: false });
    }
    else {
    }

   screepsplus.collect_stats()
   Memory.stats.cpu.used = Game.cpu.getUsed();
};