//Command to spawn claimer: Game.spawns.Spawn1.memory.claimRoom = '<roomname>'

// import modules
require('prototype.spawn')();
require('LoAN_inject');

var Traveler = require('traveler');
var roleHarvester = require('role.Harvester');
var roleMiner = require('role.Miner');
var roleCarrier = require('role.Carrier')
var roleUpgrader = require('role.Upgrader');
var roleBuilder = require('role.Builder');
var roleRepairer = require('role.Repairer');
var roleWallRepairer = require('role.WallRepairer');
var roleLongDistanceHarvester = require('role.LongDistanceHarvester');
var roleClaimer = require('role.Claimer');

var screepsplus = require('stats.screepsplus');
const profiler = require('profiler');

global.home = 'W49S23'

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function () {
        //clear memory of dead creeps
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }



        for (let name in Game.creeps) {
            var creep = Game.creeps[name];

            if (creep.memory.role == 'Harvester') {
                roleHarvester.run(creep);
            }
            else if (creep.memory.role == 'Miner') {
                roleMiner.run(creep);
            }
            else if (creep.memory.role == 'Carrier') {
                roleCarrier.run(creep);
            }
            else if (creep.memory.role == 'Upgrader') {
                roleUpgrader.run(creep);
            }
            else if (creep.memory.role == 'Builder') {
                roleBuilder.run(creep);
            }
            else if (creep.memory.role == 'Repairer') {
                roleRepairer.run(creep);
            }
            else if (creep.memory.role == 'WallRepairer') {
                roleWallRepairer.run(creep);
            }
            else if (creep.memory.role == 'LongDistanceHarvester') {
                roleLongDistanceHarvester.run(creep);
            }
            else if (creep.memory.role == 'Claimer') {
                roleClaimer.run(creep);
            }
        }


        var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
        }
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];
            let creepsInRoom = spawn.room.find(FIND_MY_CREEPS)

            var energy = spawn.room.energyCapacityAvailable;
            var name = undefined;

            var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'Harvester');
            var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'Miner');
            var numberOfCarriers = _.sum(creepsInRoom, (c) => c.memory.role == 'Carrier');
            var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'Upgrader');
            var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'Builder');
            var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'Repairer');
            var numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'WallRepairer');
            var numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'LongDistanceHarvester')

            if (numberOfHarvesters == 0 && (numberOfMiners == 0 || numberOfCarriers == 0)) {
                if (numberOfMiners > 0) {
                    name = spawn.createCarrier(spawn.room.energyAvailable);
                }
                else {
                    name = spawn.createCustomCreep(spawn.room.energyAvailable, 'Harvester');

                }
            }
            else {
                for (let source of spawn.room.find(FIND_SOURCES)) {
                    if (!_.some(creepsInRoom, c => c.memory.role == 'Miner' && c.memory.sourceID == source.id)) {
                        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                        if (containers.length > 0) {
                            name = spawn.createMiner(energy, source.id);
                            break;
                        }
                    }
                }
            }
            if (name == undefined) {
                if (numberOfHarvesters < spawn.memory.minHarvesters) {
                    name = spawn.createCustomCreep(energy, 'Harvester');
                }
                if (numberOfCarriers < spawn.memory.minCarriers) {
                    name = spawn.createCarrier(300);
                }
                else if (spawn.memory.claimRoom != undefined && ((BODYPART_COST[CLAIM] + BODYPART_COST[MOVE]) * 2 <= energy)) {
                    name = spawn.createClaimer(spawn.memory.claimRoom);
                    if (!(name < 0)) {
                        delete spawn.memory.claimRoom;
                    }
                }
                else if (numberOfLongDistanceHarvesters < spawn.memory.LongHarvesters.min) {
                    name = spawn.createLongDistanceHarvester(energy, 5, spawn.room.name, spawn.memory.LongHarvesters.target, 0);
                }
                else if (numberOfUpgraders < spawn.memory.minUpgraders) {
                    name = spawn.createCustomCreep(energy, 'Upgrader');
                }
                else if (numberOfRepairers < spawn.memory.minRepairers) {
                    name = spawn.createCustomCreep(energy, 'Repairer');
                }
                else if (numberOfBuilders < spawn.memory.minBuilders) {
                    name = spawn.createCustomCreep(energy, 'Builder');
                } else if (numberOfWallRepairers < spawn.memory.minWallRepairers) {
                    name = spawn.createCustomCreep(energy, 'WallRepairer');
                }
                else {
                    name = -1;
                }
            }
            if (!(name < 0)) {
                let creepsInRoom = spawn.room.find(FIND_MY_CREEPS)
                var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'Harvester');
                var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'Miner');
                var numberOfCarriers = _.sum(creepsInRoom, (c) => c.memory.role == 'Carrier');
                var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'Upgrader');
                var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'Builder');
                var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'Repairer');
                var numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'WallRepairer');
                var numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'LongDistanceHarvester')

                console.log('----------------------------------------');
                console.log(spawnName + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
                console.log("Harvesters    : " + numberOfHarvesters + "/" + spawn.memory.minHarvesters);
                console.log("Miners        : " + numberOfMiners);
                console.log("Carriers      : " + numberOfCarriers);
                console.log("Upgraders     : " + numberOfUpgraders + "/" + spawn.memory.minUpgraders);
                console.log("Builders      : " + numberOfBuilders + "/" + spawn.memory.minBuilders);
                console.log("Repairers     : " + numberOfRepairers + "/" + spawn.memory.minRepairers);
                console.log("WallRepairers : " + numberOfWallRepairers + "/" + spawn.memory.minWallRepairers);
                console.log("Long Harvester: " + numberOfLongDistanceHarvesters + "/" + spawn.memory.LongHarvesters.min);
                console.log('----------------------------------------');
            }
        }

        screepsplus.collect_stats()
        Memory.stats.cpu.used = Game.cpu.getUsed();

    });
};