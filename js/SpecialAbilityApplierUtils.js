/**
 * Apply spell effects.
 * By default, spell does damage to target.
 * Special cases are handled individually in if loops.
 * @param casterData
 * @param targetData
 * @param spellData
 * @param spellOutput
 */
function applyOneTargetAbilities(casterData, targetData, spellData, spellOutput) {
    var spellName = spellData['abilityName'];
    if (spellName.toUpperCase() == 'Insignia of the Rat'.toUpperCase()) {
        targetData['aggrPow'] -= spellOutput;
        // 1 is the minimum power.
        if (targetData['aggrPow'] < 1) {
            targetData['aggrPow'] = 1;
        }
    }
    else if (spellName.toUpperCase() == 'Insignia of the Turtle'.toUpperCase()) {
        targetData['aggrAgi'] -= spellOutput;
        // 1 is the minimum agi.
        if (targetData['aggrAgi'] < 1) {
            targetData['aggrAgi'] = 1;
        }
    }
    // The default case, do damage to the target.
    else {
        targetData['aggrHp'] -= spellOutput;
        // 0 is the minimum HP.
        if (targetData['aggrHp'] < 0) {
            targetData['aggrHp'] = 0;
        }
    }
}

/**
 * Default to deal damage to everyone.
 * @param casterData
 * @param targetsData
 * @param spellData
 * @param spellOutput
 */
function applyAOEAbilities(casterData, targetsData, spellData, spellOutput) {
    // No special case AOE yet. All AOE deal AOE damage.
    for (var player in targetsData) {
        var playerData = targetsData[player];
        playerData['aggrHp'] -= spellOutput;
        // 0 is the minimum HP.
        if (playerData['aggrHp'] < 0) {
            playerData['aggrHp'] = 0;
        }
    }
}

/**
 * Abilities that apply to self.
 * @param casterData
 * @param targetsData
 * @param spellData
 * @param spellOutput
 */
function applySelfCastAbilities(casterData, targetData, spellData, spellOutput) {
    var spellName = spellData['abilityName'];
    if (spellName.toUpperCase() == 'Haste'.toUpperCase()) {
        targetData['aggrAgi'] += spellOutput;
    }
    else if (spellName.toUpperCase() == 'Strength'.toUpperCase()) {
        targetData['aggrPow'] += spellOutput;
    }
    else if (spellName.toUpperCase() == 'Cure'.toUpperCase()) {
        targetData['aggrHp'] += spellOutput;
    }
}