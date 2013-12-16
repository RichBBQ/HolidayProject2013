function MessageGenerater() {
    this.attackVerbs = ['kicked', 'punched', 'chopped', 'slapped', 'tickled', 'poked', 'ambushed',
                        'bit', 'spanked', 'swatted', 'whacked', 'bashed', 'whipped', 'tossed', 'jabbed',
                        'smacked', 'kissed', 'clawed', 'choked', 'squeezed', 'clobbered', 'licked','hi-fived',
                        'jump kicked','tackled','kamehameha-ed','slobbered over','made eye contact with',
                        'jumped','shot','chatted with','undercut','grinned at','headbutted'];

    this.defeatMessage = ['has been PWNED', 'got OWNed', 'has dropped dead :(', 'cried and ran away',
                          'has been vanquished', 'has tasted defeat!', 'has been defeated', 'got GG-ed',
                          'has fallen','was too weak','couldn’t take the challenge','didn’t train hard enough',
                          'fought valiantly. Not.','has failed and accomplished nothing','has been eliminated, as expected.',
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
            message += '<span style="color:green">' + target['aggrHp'] + ' HP</span> left';
        }
        else { // target defeated
            message += '<span style="color:deepskyblue">' + target['playerName'] + '</span> ';
            message += getRandomDefeatMessage(this.defeatMessage);
        }

        return message;
    }
}