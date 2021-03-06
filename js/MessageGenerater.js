function MessageGenerater() {
    this.attackVerbs = ['kicked', 'punched', 'chopped', 'slapped', 'tickled', 'poked', 'ambushed',
                        'bit', 'spanked', 'swatted', 'whacked', 'bashed', 'whipped', 'tossed', 'jabbed',
                        'smacked', 'kissed', 'clawed', 'choked', 'squeezed', 'clobbered', 'licked','hi-fived',
                        'jump kicked','tackled','slobbered over','made eye contact with',
                        'jumped','shot','chatted with','undercut','grinned at','headbutted'];

    this.defeatMessage = ['has been PWNED', 'got OWNed', 'has dropped dead :(', 'cried and ran away',
                          'has been vanquished', 'has tasted defeat!', 'has been defeated', 'got GG-ed',
                          'has fallen','was too weak','couldn’t take the challenge','didn’t train hard enough',
                          'fought valiantly...','has failed and accomplished nothing','has been eliminated, as expected.',
                          'could not hold it together','is no longer with us'];

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var getRandomAttackVerb = function(atkVerbs) {
        var randomAttackVerbIndex = getRandomInt(0, atkVerbs.length - 1);
        return atkVerbs[randomAttackVerbIndex];
    };
    var getRandomDefeatMessage = function(defeatMessage) {
        var randIndex = getRandomInt(0, defeatMessage.length - 1);
        return defeatMessage[randIndex];

    }
    var isCriticalHit = function (attackerMaxDmg, dmgDealt) {
        if(attackerMaxDmg * 0.95 < dmgDealt) {
            return true;
        }
        return false;
    }

    var getAOEVerb = function(spellData) {
        var abilityName = spellData['abilityName'];
        if (abilityName.toUpperCase() == 'Curall'.toUpperCase()) {
            return 'gained back';
        }
        return 'suffered';
    }

    var getAOENoun = function(spellData) {
        var abilityName = spellData['abilityName'];
        if (abilityName.toUpperCase() == 'Curall'.toUpperCase()) {
            return 'HP';
        }
        return 'damage';
    }

    this.generateAttackMessage = function(attacker, target, damageDealt){
        var message = '';
        if (isCriticalHit(attacker['aggrPow'], damageDealt)) {
            message += '[CRITICAL] ';
        }
        message += attacker['playerName'] + ' ';
        message += '<span style="color:firebrick">' + getRandomAttackVerb(this.attackVerbs) + '</span> ';
        message += target['playerName'] + ' ';
        message += 'for <span style="color:red">' + damageDealt + '</span> damage!';

        message += '<br />';

        if (target['aggrHp'] > 0) {
            message += '<span style="color:deepskyblue">' + target['playerName'] + '</span> has ';
            message += '<span style="color:#0f9312">' + target['aggrHp'] + ' HP</span> left';
        }
        else { // target defeated
            message += '<span style="color:deepskyblue">' + target['playerName'] + '</span> ';
            message += getRandomDefeatMessage(this.defeatMessage);
        }

        return message;
    }

    this.generateOneTargetSpellMessage = function(caster, target, spellData, spellOutput) {
        var message = '';
        message += caster['playerName'];
        message += ' casted <span style="color:red">' + spellData['abilityName'] + '</span>';
        message += ' on ' + target['playerName'];

        message += '<br />';

        message += '<span style="color:deepskyblue">' + target['playerName'] + '</span>';
        message += ' lost ' + '<span style="color:red">' + spellOutput + '</span>';
        var spellName = spellData['abilityName'];
        if (spellName.toUpperCase() == 'Insignia of the Rat'.toUpperCase()) {
            message += ' Power';
        }
        else if (spellName.toUpperCase() == 'Insignia of the Turtle'.toUpperCase()) {
            message += ' Agility';
        }
        else {
            message += ' HP';
        }
        return message;
    }

    this.generateAOESpellMessage = function(caster, targets, spellData, spellOutput) {
        var message = '';
        message += caster['playerName'];
        message += ' casted <span style="color:red">' + spellData['abilityName'] + '</span>';

        message += '<br />';

        message += 'All players ';
        message += getAOEVerb(spellData) + ' ' + spellOutput + ' ' + getAOENoun(spellData);
        return message;
    }

    this.generateSelfCastSpellMessage = function(caster, target, spellData, spellOutput) {
        var message = '';
        message += caster['playerName'];
        message += ' casted <span style="color:red">' + spellData['abilityName'] + '</span>';
        message += ' on self!';

        message += '<br />';

        message += caster['playerName'];
        message += ' gained ' + '<span style="color:red">' + spellOutput + '</span>';
        var spellName = spellData['abilityName'];
        if (spellName.toUpperCase() == 'Haste'.toUpperCase() || spellName.toUpperCase() == 'Soaring Wings'.toUpperCase()) {
            message += ' Agility'
        }
        else if (spellName.toUpperCase() == 'Strength'.toUpperCase() || spellName.toUpperCase() == 'Super Saiyan'.toUpperCase()) {
            message += ' Power';
        }
        else if (spellName.toUpperCase() == 'Cure'.toUpperCase()) {
            message += ' HP';
        }
        return message;
    }

    this.generateSpellCastingMessage = function(caster, spellData) {
        var message = '';
        message += caster['playerName'] + ' is casting ';
        message += '<span style="color:red">' + spellData['abilityName'] + '</span>';
        return message;
    }

    this.generateAttackingMessage = function(attacker) {
        var message = '';
        message += '<span style="color:#0f9312">' + attacker['playerName'] + '</span> is attacking';
        return message;
    }
}