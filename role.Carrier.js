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
            creep.PutEnergy(false)
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 });

            if (container == undefined) {
                container = creep.room.storage;
            }

            // try to harvest energy, if the source is not in range
            let action = creep.withdraw(container, RESOURCE_ENERGY);
            switch (action) {
                case OK:
                    creep.say('📤 Collect', true);
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.travelTo(container);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${creep}).withdraw(${container}): ${action}`);
            }
        }
    }
};