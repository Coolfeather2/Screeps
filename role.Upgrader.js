module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            let action = creep.upgradeController(creep.room.controller);
            switch (action) {
                case OK:
                    creep.say('Praise GCL', true);
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.travelTo(creep.room.controller);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${creep}).withdraw(${creep.room.controller}): ${action}`);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            creep.GetEnergy(true, true)
        }
    }
};
