function SpecialAbilityHandler(actorData) {
    var CAST_SPELL = 0;
    var NORMAL_ATTACK = 1;
    var SPECIAL_ABILITY_PREFIX = 'sa';
    var SPECIAL_ABILITY_COUNT = 3;
    var actorData = actorData;

    /**
     * Private helper function to extract ability data. If the
     * ability data is valid, we stuff the parsed result into
     * candidateAbilities. Parse result is a map of abilityData.
     * Ex: Ability data of "G_50_O_Skill Name_13_100_200"
     * Will result in a map like this:
     * {
     *      condition: 'G',
     *      threshold: 50,
     *      abilityType: 'O',
     *      abilityName: 'Skill Name',
     *      castChance: 13,
     *      minBound: 100,
     *      maxBound: 200
     * }
     * @param candidateAbilities
     * @param abilityData
     */
    var parseAbilityData = function(candidateAbilities, abilityData) {
        if (abilityData == undefined || abilityData == '') {
            return;
        }
        var dataArray = abilityData.split('_'); // _ is the delimeter
        if (dataArray.length != 7) { // malformed data. not good, throw away.
            return;
        }
        var abilityDataMap = {};
        abilityDataMap['condition'] = dataArray[0];
        abilityDataMap['threshold'] = parseInt(dataArray[1]);
        abilityDataMap['abilityType'] = dataArray[2];
        abilityDataMap['abilityName'] = dataArray[3];
        abilityDataMap['castChance'] = parseInt(dataArray[4]);
        abilityDataMap['minBound'] = parseInt(dataArray[5]);
        abilityDataMap['maxBound'] = parseInt(dataArray[6]);
        candidateAbilities.push(abilityDataMap);
    }

    var generateNormalAttackAction = function() {
        var normalAttackAction = {};
        normalAttackAction['action'] = NORMAL_ATTACK;
        normalAttackAction['spellData'] = undefined;
        return normalAttackAction;
    }

    var generateSpellCastingAction = function(abilityData) {
        var castSpellAction = {};
        castSpellAction['action'] = CAST_SPELL;
        castSpellAction['spellData'] = abilityData;
        return castSpellAction;
    }

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        CAST_SPELL: CAST_SPELL,

        NORMAL_ATTACK: NORMAL_ATTACK,

        /**
         * Determine action to take.
         * @return action map.
         * ex: {
         *          action: (NORMAL_ATTACK | CAST_SPELL),
          *         spellData: {...}
         *     }
         */
        determineAction: function() {
            // First pass, get out all the available abilities
            var availableAbilities = [];
            for (var i = 1; i <= SPECIAL_ABILITY_COUNT; i++) {
                var abilityIndex = SPECIAL_ABILITY_PREFIX + i;
                var abilityData = actorData[abilityIndex];
                parseAbilityData(availableAbilities, abilityData);
            }
            if (availableAbilities == undefined || availableAbilities.length <= 0) {
                return generateNormalAttackAction();
            }

            // If there are spells available, proceed to check spells' casting condition.
            var usableAbilities = []; // abilities whose threshold are met.
            for (var i = 0; i < availableAbilities.length; i++) {
                var abilityData = availableAbilities[i];
                var isHpThresholdMet = false;
                if (abilityData['condition'] == 'G') { // Greater than threshold
                    isHpThresholdMet = (actorData['aggrHp'] > abilityData['threshold']);
                }
                else if (abilityData['condition'] == 'L') { // Less than threshold
                    isHpThresholdMet = (actorData['aggrHp'] < abilityData['threshold']);
                }
                else if (abilityData['condition'] == 'N') { // No threshold needed
                    isHpThresholdMet = true;
                }
                if (isHpThresholdMet) {
                    usableAbilities.push(abilityData);
                }
            }
            if (usableAbilities == undefined || usableAbilities.length <= 0) {
                return generateNormalAttackAction();
            }

            // Choose one ability to use by randomizing against the abilities' probabilities
            var compoundProb = 0;
            for (var i = 0; i < usableAbilities.length; i++) {
                var ability = usableAbilities[i];
                compoundProb += ability['castChance'];
            }
            if (compoundProb < 100) {
                // Sum of chances are not 100%. Leaving room for auto-attack.
                // In this case, we use 100% as the compooundProb to randomize.
                compoundProb = 100;
            }
            var randomizedPointer = getRandomInt(0, compoundProb);
            for (var i = 0; i < usableAbilities.length; i++) {
                var ability = usableAbilities[i];
                var abilityCastChance = ability['castChance'];
                if (abilityCastChance < randomizedPointer) {
                    // Pointer too high, not this ability... :(
                    randomizedPointer -= abilityCastChance;
                }
                else {
                    // Pointer below chance threshold, that means this ability is selected
                    return generateSpellCastingAction(ability);
                }
            }
            // If no spell is selected by now, normal attack is the way to go!
            return generateNormalAttackAction();
        }
    };
}