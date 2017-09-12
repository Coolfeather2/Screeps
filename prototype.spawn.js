module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
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
        function (energy, numberOfWorkParts, home, target, sourceID) {
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
            return this.createCreep(body, undefined, { role: 'LongDistanceHarvester', home: home, target: target, sourceID: sourceID, working: false });
        };
    StructureSpawn.prototype.createClaimer =
        function (target) {
            return this.createCreep([CLAIM, CLAIM, MOVE, MOVE], undefined, { role: 'Claimer', target: target })
        };
    StructureSpawn.prototype.createMiner =
        function (energy, sourceID) {
            var body = [];
            energy -= BODYPART_COST[MOVE];

            var numberOfParts = Math.floor(energy / BODYPART_COST[WORK]);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }

            body.push(MOVE)

            return this.createCreep(body, undefined, { role: 'Miner', sourceID: sourceID })
        };
    StructureSpawn.prototype.createCarrier =
        function (energy) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]));
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
};