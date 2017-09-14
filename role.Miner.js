module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        let source = Game.getObjectById(creep.memory.sourceID);
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER })[0];

        if (creep.pos.isEqualTo(container.pos)) {
            let action = creep.harvest(source);
            switch (action) {
                case OK:
                    var song = [
                        'Work it',
                        'Make it',
                        'Do it',
                        'Make us',
                        'Harder',
                        'Better',
                        'Faster',
                        'Stronger',
                        'More than',
                        'Hour',
                        'Our',
                        'Never',
                        'Ever',
                        'After',
                        'Work is',
                        'Over',
                    ]
                    let say = song[Math.floor(Math.random() * song.length)];
                    creep.say(say, true);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${creep}).harvest(${source}): ${action}`);
            }
        }
        else {
            creep.travelTo(container);
        }
    }
};