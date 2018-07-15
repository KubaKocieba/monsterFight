var monsterA           = 0,
    attackReleaseCount = 0,
    imgYou = new Image(),
    imgMonster = new Image(),
    animateYou,
    animateMid,
    animateMonster,
    attackTimer = 0,
    specAttackTimer = 0,
    healTimer = 0;

function stopMonsterAttacks(){
  clearInterval(monsterA);
}