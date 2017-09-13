var roles = {
    Harvester: require('role.Harvester'),
    Miner: require('role.Miner'),
    Carrier: require('role.Carrier'),
    Upgrader: require('role.Upgrader'),
    Builder: require('role.Builder'),
    Repairer: require('role.Repairer'),
    WallRepairer: require('role.WallRepairer'),
    LongDistanceHarvester: require('role.LongDistanceHarvester'),
    Claimer: require('role.Claimer'),
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    }


Creep.prototype.GetEnergy =
    function (useContainer, useSource) {

        let container;

        if (useContainer) {
            let container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0 });
            if (container != undefined) {
                let action = this.withdraw(container, RESOURCE_ENERGY);
                switch (action) {
                    case OK:
                        this.say('📤 Collect', true);
                        break;
                    case ERR_NOT_IN_RANGE:
                        this.travelTo(container);
                        break;
                    case ERR_BUSY:
                        break;
                    default:
                        console.log(`unknown result from (${this}).withdraw(${container}): ${action}`);
                }
            }
        }

        if (container == undefined && useSource) {
            let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            let action = this.harvest(source);
            switch (action) {
                case OK:
                    this.say('⛏ Harvest', true);
                    break;
                case ERR_NOT_IN_RANGE:
                    this.travelTo(source);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${this}).harvest(${source}): ${action}`);
            }
        }
    }


Creep.prototype.PutEnergy =
    function (upgrade) {
        let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity });
        if (structure == undefined) {
            structure = this.room.storage;
        }
        
        if (structure != undefined) {
            // try to transfer energy, if the spawn is not in range
            let action = this.transfer(structure, RESOURCE_ENERGY);
            switch (action) {
                case OK:
                    this.say('📥 Deposit', true);
                    break;
                case ERR_NOT_IN_RANGE:
                    this.travelTo(structure);
                    break;
                case ERR_BUSY:
                    break;
                default:
                    console.log(`unknown result from (${this}).transfer(${structure}): ${action}`);
            }
        }
        else if (upgrade){
            roleUpgrader.run(creep);
        }
    }