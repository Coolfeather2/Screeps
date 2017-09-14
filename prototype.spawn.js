var listOfRoles = ['Harvester', 'Carrier', 'Upgrader', 'Builder', 'Repairer', 'WallRepairer']

StructureSpawn.prototype.spawnCreeps =
    function () {
        let creepsInRoom = this.room.find(FIND_MY_CREEPS)

        let numberOfCreeps = {}
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let energy = this.room.energyCapacityAvailable;
        let name = undefined;

        if (numberOfCreeps['Harvester'] === 0 && numberOfCreeps['Carrier'] === 0) {
            if (numberOfCreeps['Miner'] > 0 || (this.room.storage != undefined && this.room.storage.store[RESOURCE_ENERGY] >= (((SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME / 2) * BODYPART_COST[WORK] + BODYPART_COST[MOVE]) + 150))) {
                name = this.createCarrier(150);
            }
            else {
                name = this.createCustomCreep(this.room.energyAvailable, 'Harvester');

            }
        }
        else {
            for (let source of this.room.find(FIND_SOURCES)) {
                if (!_.some(creepsInRoom, c => c.memory.role == 'Miner' && c.memory.sourceID == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                    if (containers.length > 0) {
                        name = this.createMiner(energy, source.id);
                        break;
                    }
                }
            }
        }

        if (name == undefined) {
            for (let role of listOfRoles) {
                if (role == 'Claimer' && this.memory.claimRoom != undefined && ((BODYPART_COST[CLAIM] + BODYPART_COST[MOVE]) * 2 <= energy)) {
                    name = this.createClaimer(this.memory.claimRoom);
                    if (!(name < 0)) {
                        delete this.memory.claimRoom;
                    }
                }
                else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
                    if (role == 'Carrier') {
                        name = this.createCarrier(150);
                    }
                    else {
                        name = this.createCustomCreep(energy, role);
                    }
                }
            }
        }

        let numberOfLongDistanceHarvesters = {}
        if (name == undefined) {
            for (let roomName in this.memory.LongDistanceHarvesters) {
                numberOfLongDistanceHarvesters[roomName] = _.sum(creepsInRoom, (c) => c.memory.role == 'LongDistanceHarvester' && c.memory.target == roomName);
                if (numberOfLongDistanceHarvesters[roomName] < this.memory.LongDistanceHarvesters[roomName]) {
                    name = this.createLongDistanceHarvester(energy, 4, this.room.name, roomName, 0);
                }
            }
        }

        if (name != undefined && _.isString(name)) {
            console.log('----------------------------------------');
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role] + "/" + this.memory.minCreeps[role]);
            }
            for (let roomName in numberOfLongDistanceHarvesters) {
                console.log("Distance Harvester " + roomName + ": " + numberOfLongDistanceHarvesters[roomName] + "/" + this.memory.LongDistanceHarvesters[roomName]);
            }
            console.log('----------------------------------------');
        }
    }


StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / (BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE]));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: roleName, working: false });
    };


StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= (BODYPART_COST[WORK] + BODYPART_COST[MOVE]) * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]));
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }
        // create creep with the created body
        return this.createCreep(body, undefined, { role: 'LongDistanceHarvester', home: home, target: target, sourceIndex: sourceIndex, working: false });
    };


StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.createCreep([CLAIM, CLAIM, MOVE, MOVE], undefined, { role: 'Claimer', target: target })
    };


StructureSpawn.prototype.createMiner =
    function (energy, sourceID) {
        var body = [];
        energy -= BODYPART_COST[MOVE];

        var numberOfParts = (SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME / 2);
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }

        body.push(MOVE)

        return this.createCreep(body, undefined, { role: 'Miner', sourceID: sourceID })
    };


StructureSpawn.prototype.createCarrier =
    function (energy) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / (BODYPART_COST[CARRY] * 2 + BODYPART_COST[MOVE]));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: 'Carrier', working: false });
    };