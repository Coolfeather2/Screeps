var roleUpgrader = require('role.Upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.travelTo(creep.pos.findClosestByRange(exit));
            return;
        }
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
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the spawn
                    creep.travelTo(constructionSite);
                }
                let action = creep.build(constructionSite);
                switch (action) {
                    case OK:
                        creep.say('⚒ Building', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.travelTo(constructionSite);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${creep}).build(${container}): ${action}`);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            creep.GetEnergy(true, false)
        }
    }
};
