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
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity });

            if (structure == undefined) {
                structure = creep.room.storage;
            }

            if (structure != undefined) {
                // try to transfer energy, if the spawn is not in range
                let action = creep.transfer(structure, RESOURCE_ENERGY);
                switch (action) {
                    case OK:
                        creep.say('📥 Deposit', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.travelTo(structure);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${creep}).transfer(${structure}): ${action}`);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            let action = creep.harvest(source);
            switch (action) {
                case OK:
                    creep.say('⛏ Harvest', true);
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.travelTo(source);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${creep}).harvest(${source}): ${action}`);
            }
        }
    }
};
