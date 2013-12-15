function MessageGenerater() {
    this.attackVerbs = ['kicked', 'punched', 'chopped', 'slapped', 'tickled', 'poked', 'ambushed',
                        'bit', 'pulverized', 'grieved', 'spanked', 'swatted', 'whacked', 'bashed',
                        'whipped', 'tossed', 'jabbed', 'smacked', 'kissed', 'clawed', 'choked',
                        'squeezed'];

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var getRandomAttackVerb = function(atkVerbs) {
        var randomAttackVerbIndex = getRandomInt(0, atkVerbs.length - 1);
        return atkVerbs[randomAttackVerbIndex];
    };

    this.generateAttackMessage = function(attacker, target, damageDealt){
        var message = '';
        message += attacker['playerName'] + ' ';
        message += getRandomAttackVerb(this.attackVerbs) + ' ';
        message += target['playerName'] + ' ';
        message += 'for ' + damageDealt + ' damage!';
        return message;
    }
}