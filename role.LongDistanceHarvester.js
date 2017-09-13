var roleUpgrader = require('role.Upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn
        if (creep.memory.working == true) {
            if (creep.room.name == creep.memory.home) {
                creep.PutEnergy(true)
            }
            else {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.travelTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            if (creep.room.name == creep.memory.target) {
                creep.GetEnergy(false, true)
            }
            else {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.travelTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};