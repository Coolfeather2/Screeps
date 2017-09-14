module.exports = {
    run: function (creep) {
        if (creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.travelTo(creep.pos.findClosestByRange(exit));
        }
        else {
            var claimedRooms = []
            for (let room_name in Game.rooms) {
                let room = Game.rooms[room_name]
                if (room.controller && room.controller.my) {
                    claimedRooms.push(room);
                }
            }

            if (claimedRooms.length == Game.gcl.level) {
                let action = creep.reserveController(creep.room.controller);
                switch (action) {
                    case OK:
                        creep.say('🚩 Reserve', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.travelTo(creep.room.controller);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${creep}).reserveController(${creep.room.controller}): ${action}`);
                }
            }
            else {
                let action = creep.claimController(creep.room.controller);
                switch (action) {
                    case OK:
                        creep.say('🚩 Claim', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.travelTo(creep.room.controller);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${creep}).reserveController(${creep.room.controller}): ${action}`);
                }
            }
        }
    }
};