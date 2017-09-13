//Command to spawn claimer: Game.spawns.Spawn1.memory.claimRoom = '<roomname>'
//Command to send worker to another room: Game.creeps.<creepname>.memory.target = '<roomname>''
//memory: {"minCreeps":{"Harvester":0,"Carrier":0,"Upgrader":0,"Builder":0,"Repairer":0,"WallRepairer":0},"LongDistanceHarvesters":{"W0N0":0}}

//forceInjectLoAN()

// import modules
require('LoAN_inject');

require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');

var Traveler = require('traveler');
var screepsplus = require('stats.screepsplus');

module.exports.loop = function () {
    //clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    //run creep roles
    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }

    //towers attack enemy creeps
    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.defend();
    }

    //spawner spawns neccessary creeps
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].spawnCreeps();
    }

    screepsplus.collect_stats()
    Memory.stats.cpu.used = Game.cpu.getUsed();
};