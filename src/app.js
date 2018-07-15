new Vue({
  el: '#app',
  data:{
    battle: false,
    started: false,
    monster : 100,
    you: 100,
    eventsList : [],
    specAttack: true,
    canHeal: true,
    monsterA: 0,
    tired: false,
    attackAmount: 0,
    attackReveal:0,
    specAttackReveal: 0,
    healReveal: 0,
    tiredReveal: 0
  },
  watch:{
    you: function(health){

      if (health <= 0)
      {
        this.monsterWins();
      }
    },
    monster: function(health){
      if (health <=0 )
        this.youWin();
    }
  },
  computed:{
    gradientSpec(){
      if (!this.tired)
      {
        if (this.specAttackReveal) {
          return 'linear-gradient(to left, #fff ' + this.specAttackReveal + '%, #ffaf4f 0%)'
        }
      }
      else{
        if (this.attackReveal)
        {
          return 'linear-gradient(to left, #fff ' + this.attackReveal + '%, red 0%)'
        }
      }
    },
    tiredGradient(){
      if (this.attackReveal)
        {
          return 'linear-gradient(to left, #fff ' + this.attackReveal + '%, red 0%)'
        }
    },
    healGradient(){
      if (this.healReveal)
      {
        return 'linear-gradient(to left, #fff ' + this.healReveal + '%, #aaffb0 0%)'
      }
    }
  },
  methods:{
    restartGame(){
      clearInterval(monsterA);
      clearInterval(specAttackTimer);
      clearInterval(attackTimer);
      clearInterval(healTimer);
      clearTimeout(attackReleaseCount);

      this.eventsList = [];

      this.attackAmount = 0;
      this.tired  = false;
      this.canHeal = true;
      this.specAttack = true;

      this.healReveal = 0;
      this.attackReveal = 0;
      this.tiredReveal = 0;
      this.specAttackReveal = 0;
    },
    startOver(){
      this.restartGame();
      this.eventsList.unshift('The battle begins!!!');

      this.monster = 100;
      this.you     = 100;

      this.started = true;
      this.battle = true;

      animationYou();
      animationMonster();
      this.monsterAttacking(2000);
    },
    monsterAttacking(monsterAttackTime){
        var vm = this;
        monsterA = setInterval(function(){
          var hit = 0,
              hitMultiply = vm.tired ? 1.5 : 1.9,
              hitFail = vm.you - (Math.round(hitMultiply*vm.monster*Math.random()));

        if (hitFail < 65){
          hit = Math.round(vm.monster/10 + 10 * Math.random());
        }

        vm.you -= hit;

        animationMonster({
          len: 5,
          path: 'monsterAttack',
          loop: false
        })

        if(hit > 0)
        {
          setTimeout(()=>{
            monsterHits(hit, vm.you);
          }, 400);
        }
        else
        {
          monsterMisses();
        }

        vm.eventsList.unshift(hit > 0 ? ('Monster attacks you with strength ' + hit) : 'Monster misses a hit!!!');
      }, monsterAttackTime);
    },
    attack(){
      this.eventsList = [];

      attackLimit = this.you > 85 ? 3 : (this.you > 30 ? 2 : 1);

      if(!this.tired)
      {
        ++this.attackAmount;
      }

      //clearInterval(attackTimer);
      clearTimeout(attackReleaseCount);

      if (this.attackAmount >= attackLimit)
      {
        this.tired = true;
        this.eventsList.unshift('You are exhausted after attacking too much and too fast. You cannot attack');
      }

      if (!this.tiredReveal)
      {
        stopMonsterAttacks();
        var hit         = Math.round(10*Math.random()),
            counterMultiply = this.tired ? 1.4 : 1.8,
            counterFail = this.you - (Math.round(counterMultiply*this.monster * Math.random())),
            counter     = 0;

        if (counterFail < 50)
        {
          counter = Math.round(10 * Math.random());
        }

        this.you -= counter;
        this.monster -= hit;

        this.eventsList.unshift(hit > 0 ? 'You attack monster with strength ' + hit : 'Your attack was unsuccesfull');
        this.eventsList.unshift(counter > 0 ? ('Monster counters with damage ' + counter) : ('Monster\'s counter didn\'t succeed'));

        this.monsterAttacking(2000 + (100 - this.monster)*13);

        animationYou({
          len  : 13,
          path  : 'snakeShoot',
          loop  : false
        });

        if (hit > 0)
        {
          youHit(hit, this.monster);
        }
        else
        {
          youMiss();
        }
      }
      if (this.tired)
      {
        if(!this.tiredReveal)
        {
          var vm  = this;

          this.tiredReveal = Date.now();

          attackTimer = setInterval(function(){
            var timer = Date.now()  - (vm.tiredReveal + 3000);

            vm.attackReveal = -Math.round(timer/3000*100);

            if (timer > 0)
            {
              if (vm.battle)
              {
                this.eventsList = [];
                vm.tired = false;
                vm.attackAmount = 0;
                vm.eventsList.unshift('You are fresh again. Attack!!');
                vm.attackReveal = 0;
                vm.tiredReveal = 0;
              }

              clearInterval(attackTimer);
            }
          },0);
        }
      }

      var release = this;

      attackReleaseCount = setTimeout(function(){
        release.attackAmount = 0;
      }, this.you > 85 ? 2000 : 1500);
    },
    specialAttack(){
      if (!this.attackReveal && this.specAttack) {
        stopMonsterAttacks();
        this.eventsList = [];

        this.specAttack = false;
        this.attackAmount += 2;

        attackLimit = this.you > 85 ? 4 : (this.you > 30 ? 3 : 2);

        if (this.attackAmount >= attackLimit)
        {
          this.tired = true;
          this.eventsList.unshift('You are exhausted after attacking too much and too fast. You cannot attack');
        }

        animationYou({
          len: 12,
          path: 'snakeSpecial',
          loop: false
        });

        var vm = this,
            time = 6000+3000*Math.random(),
            end = Date.now() + time;

        specAttackTimer = setInterval(function(){
          var timer = Date.now() - end;

          vm.specAttackReveal = -Math.round(timer/time*100);

          if (timer > 0)
          {
            if (vm.battle)
            {
              this.eventsList = [];
              vm.specAttack = true;
              vm.specAttackReveal = 0;
              vm.eventsList.unshift('Special attack available again!');
            }

            clearInterval(specAttackTimer);
          }
        },0);

        let hit         = 20 - Math.round(10*Math.random()),
            counter     = 0,
            counterFail = 1.2*this.you - (Math.round(this.monster * Math.random()));

        if (counterFail < 30)
        {
          counter = Math.round(Math.round(this.monster/10 + 7 * Math.random()));
        }

        if (hit > 0)
        {
          setTimeout(()=>{
            youHit(hit, this.monster);
          }, 800);

          setTimeout(()=>{
            vm.monster -= hit;
            vm.you     -= counter;
          }, 900);
        }
        else
        {
          youMiss();
        }

        this.eventsList.unshift('You attack monster with strength ' + hit);
        this.eventsList.unshift(counter > 0 ? ('Monster counters with damage ' + counter) : ('Monster\'s counter didn\'t succeed'));
        this.eventsList.unshift('Special Attack will be reloaded after ' + (time/1000).toFixed(1) + ' seconds');

        this.monsterAttacking(2000 + (100 - this.monster)*13);
      }

      if (this.tired)
      {
        this.eventsList.unshift('You are exhausted after attacking too fast. You cannot attack');
      }

      var release = this;

      attackReleaseCount = setTimeout(function(){
        release.attackAmount = 0;
      }, this.you > 85 ? 3000 : 2000);
    },

    heal(){

      if (!!this.canHeal)
      {
        // this.eventsList = [];
        var heal = 10;

        if (this.you < 90) {this.you += 10}
        else {
          heal = 100-this.you;
          this.you += heal;
        }

        this.eventsList.unshift('You gained back ' + heal + ' HP');

        var vm = this,
            time = 5000+5000*Math.random();

        this.canHeal = false;

        this.eventsList.unshift('You will be able to use healing in ' + (time/1000).toFixed(1) + ' seconds');

        var end = Date.now() + time;

        healTimer = setInterval(function(){
           var timer = Date.now() - end;

          vm.healReveal = -Math.round(timer/time*100);

          if (timer > 0)
          {

          if (vm.battle)
            {
              this.eventsList = [];
              vm.canHeal = true;
              vm.eventsList.unshift('You can heal yourself again!');
              vm.healReveal = 0;
            }
          clearInterval(healTimer);
          }
        }, 0);

        animationYou({
          len: 8,
          path: 'snakeHeal',
          loop: false
        })

        setTimeout(function(){
          actionToCanvas({
              canv:   'youCanvas',
              type:   'heal',
              action:  heal
            });
        }, 450);
      }
    },
    giveup(){
      this.restartGame();
      this.battle = false;
      this.eventsList.unshift('That\'s sad but You gave up!');
    },
    youWin(){
      animationYou({
        len: 11,
        path: 'snakeWin',
        loop: 3,
        stay: true
      });

      animationMonster({
        len: 7,
        path: 'monsterLose',
        loop: 2,
        stay: true
      });

      this.restartGame();
      this.battle = false;
      this.eventsList.unshift('Bravo! The monster is defeated!');
    },
    monsterWins(){
      animationYou({
        len: 5,
        path: 'snakeLose',
        loop: 2,
        stay: true
      });

      animationMonster({
        len: 4,
        path: 'monsterWin',
        loop: 2,
        stay: false

      })

      this.restartGame();
      this.battle = false;
      this.eventsList.unshift('Shit! Monster defeated You! Now the whole land is affraid of its power');
    }
  }

});