﻿var roleBuilder = require('role.Builder');

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
            // try to transfer energy, if the spawn is not in range
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART });
            if (structure != undefined) {
                let action = creep.repair(structure);
                switch (action) {
                    case OK:
                        creep.say('🔧 Repair', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.travelTo(structure);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${creep}).repair(${structure}): ${action}`);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0 });
            // try to harvest energy, if the source is not in range
            if (container != undefined) {
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
    }
};
