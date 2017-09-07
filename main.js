
// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
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
    var minumumNumberOfUpgraders = 3;
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');

    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        var name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'Harvester', working: false });
    }
    else if (numberOfUpgraders < minumumNumberOfUpgraders) {
        var name = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'Upgrader', working: false });
    }


    if (!(name < 0)) {
            console.log("Spawned new creep: " + name);
    }
};