function Battle(player, enemy) {
  this.player = player;
  this.enemy = enemy;
  this.state = "preperation";
  this.playerCombatDocket = [];
  this.enemyCombatDocket = [];
}

var executeAbility = function (ability, user, opponent, i, docket) {
  if(ability.target === "opponent") {
    var target = opponent;
  } else {
    var target = user;
  }

  var execution = "ability." + ability.method + "(user, target);";
  var damage = eval(execution);
  gamelogAttack(docket, user, target, ability, damage, i);
};

Battle.prototype.executeCombat = function() {
  //Set State
  this.state = "execution";
  updateHUD(this.player, this.enemy, this);

  //Determine Order
  var isFirst = "this." + checkFirst(this.player, this.enemy);
  var isSecond = "this." + checkSecond(isFirst);
  var firstDocket = isFirst + "CombatDocket";
  var secondDocket = isSecond + "CombatDocket";

  //Execute Abilities
  for(var i = 0; i < eval(firstDocket).length; i++) {
    executeAbility(eval(firstDocket)[i], eval(isFirst), eval(isSecond), i, eval(firstDocket));
  }

  for(var i = 0; i < eval(secondDocket).length; i++) {
    executeAbility(eval(secondDocket)[i], eval(isSecond), eval(isFirst), i, eval(secondDocket))
  }


  //Reset Turn
  this.playerCombatDocket = [];
  this.enemyCombatDocket = [];
  this.player.stats.currentAP = this.player.stats.maxAP;
  this.player.stats.tempCurrentAP = this.player.stats.maxAP;
  this.enemy.stats.currentAP = this.enemy.stats.maxAP;
  this.enemy.stats.tempCurrentAP = this.enemy.stats.maxAP;
  this.state = "preperation";
  updateHUD(this.player, this.enemy, this);

};

var checkFirst = function(player, enemy) {
  if (player.stats.maxAP > enemy.stats.maxAP) {
    return "player";
  } else if (enemy.stats.maxAP) {
    return "enemy";
  } else {
    return "tie";
  }
}

var checkSecond = function(isFirst) {
  if(isFirst === "tie") {
    return "N/A";
  } else if(isFirst === "player") {
    return "enemy";
  } else {
    return "player";
  }
}
