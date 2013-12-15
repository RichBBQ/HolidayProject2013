function MessageGenerater() {
    this.attackVerbs = ['kicked', 'punched', 'chopped', 'slapped', 'tickled', 'poked', 'ambushed',
                        'bit', 'pulverized', 'grieved', 'spanked', 'swatted', 'whacked', 'bashed',
                        'whipped', 'tossed', 'jabbed', 'smacked', 'kissed', 'clawed', 'choked',
                        'squeezed'];
    this.defeatMessage = ['is PWNED', 'has been OWNed', 'has dropped dead :(', 'cried and ran away', 'has gone to heaven',
                          'is pulverized!', 'is defeated', 'is GG-ed', 'is sacrificed to appease the game creater',
                          'is sacrificed for the glory of Tim Fong'];

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

    this.generateAttackMessage = function(attacker, target, damageDealt){
        var message = '';
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