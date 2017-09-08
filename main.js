// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var screepsplus = require('screepsplus')

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
    }

    var minimumNumberOfHarvesters = 3;
    var minumumNumberOfUpgraders = 10;
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');
    var name = undefined;

    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'Harvester', working: false });
    }
    else if (numberOfUpgraders < minumumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'Upgrader', working: false });
    }

   screepsplus.collect_stats()
   Memory.stats.cpu.used = Game.cpu.getUsed();
};