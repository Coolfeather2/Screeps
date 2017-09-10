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
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                }
            }
            else {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                }
            }
        }
    }
};