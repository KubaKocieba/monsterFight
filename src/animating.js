imgYou.addEventListener('load', function(file) {
    drawYou(file.path[0]);
}, false);

imgMonster.addEventListener('load', function(file) {
    drawMonster(file.path[0]);
}, false);


var blastInitial = Number(document.querySelector('#monsterBlast').style.right.split(/([A-z].+)/)[0]);

function animationMonster(which)
{
  clearInterval(animateMonster);

  var base = which === undefined ? 9 : which.len,
      monsterPath = './src/gfx/' + (which === undefined ? 'monsterBase' : which.path ) + '/';

  var frame = 0;

  animateMonster = setInterval(function(){

    if (frame !== undefined && frame !== base -1)
    {
      frame++;

      if(which && which.path === 'monsterAttack' && frame === 4)
      {
        var blast = document.querySelector('#monsterBlast');

        blast.style.visibility ='visible';

        let kuba = setInterval(()=>{
            let value = blast.style.right.split(/([A-z].+)/);

            if(Number(value[0]) > blastInitial * 3.5){
              document.querySelector('#monsterBlast').style.right = blastInitial + value[1];

              //document.querySelector('#rocketBoom').style.visibility ='visible';

              setTimeout(() => {
                blast.style.visibility = 'hidden';
              },0);

              // setTimeout(() => {
              //   document.querySelector('#rocketBoom').style.visibility ='hidden';
              // } , 1000);

              clearInterval(kuba);
            }
            else{
              blast.style.right = (Number(value[0]) + (blastInitial / 9)) + value[1];
            }
          }, 24);
      }
    }
    else if(which === undefined || !!which.loop)
    {
      frame = 0;
      if (which !== undefined && which.loop) --which.loop;
    }
    else
    {
      if (which !== undefined && which.stay !== undefined && which.stay)
      {
        return;
      }

      animationMonster();
    }

    imgMonster.src = monsterPath + (frame > 9 ? '' :  '0') +  frame + '.png';
  }
  ,100);
}

var rocketInitial = Number(document.querySelector('#rocket').style.left.split(/([A-z].+)/)[0]);

function animationYou(which){

  clearInterval(animateYou);

  var base = which === undefined ? 6 : which.len,
      snakePath = './src/gfx/' + (which === undefined ? 'snakeBase' : which.path ) + '/';

  var frame = 0;

  animateYou = setInterval(function(){

    if (frame !== undefined && frame !== base -1)
    {
      frame++;

      if(which && which.path === 'snakeSpecial' && frame === 7)
      {
        var rocket = document.querySelector('#rocket');

        rocket.style.visibility ='visible';

        let kuba = setInterval(()=>{
            let value = rocket.style.left.split(/([A-z].+)/);

            if(Number(value[0]) > rocketInitial * 2){
              document.querySelector('#rocket').style.left = rocketInitial + value[1];

              document.querySelector('#rocketBoom').style.visibility ='visible';

              setTimeout(() => {
                rocket.style.visibility = 'hidden';
              },0);

              setTimeout(() => {
                document.querySelector('#rocketBoom').style.visibility ='hidden';
              } , 1000);

              clearInterval(kuba);
            }
            else{
              rocket.style.left = (Number(value[0]) + (rocketInitial / 9)) + value[1];
            }
          }, 24);
      }

      if(which && which.path === 'snakeShoot' && frame  === 4){
        document.querySelector('#pistolBlast').style.visibility = 'visible';

        setTimeout(()=>{
          document.querySelector('#pistolBlast').style.visibility = 'hidden';
        }, 300);
      }
    }
    else if(which === undefined || !!which.loop)
    {
      frame = 0;
      if (which !== undefined && which.loop) --which.loop;
    }
    else
    {
      if (which !== undefined && which.stay !==undefined && which.stay)
      {
        return;
      }

      animationYou();
    }

    imgYou.src = snakePath + (frame > 9 ? '' :  '0') +  frame + '.png';
  }
  ,100);
}

function drawMonster(im) {
  let ctx = document.getElementById('monsterCanvas').getContext('2d'),
      posX = 150,
      posY = 40;

  ctx.clearRect(posX, posY, 1.2* im.width, 1.4*im.height); // clear canvas
  ctx.save();

  ctx.drawImage(imgMonster, posX,posY);
}


function drawYou(im) {
  let ctx = document.getElementById('youCanvas').getContext('2d'),
      posX= 50,
      posY= 20;

  ctx.clearRect(posX, 0, im.width*1.2, im.height*1.4); // clear canvas
  ctx.save();

  im.src.indexOf('snakeGotHit') !== -1? posY = 0 : '';

  ctx.drawImage(imgYou, posX, posY, im.width, im.height);
}

function actionToCanvas(actionObj)
{
  var ctx = document.getElementById(actionObj.canv).getContext('2d'),
      actionColor = function(type){
        switch(type){
          case 'hit':
            return 'red';
          case 'heal':
            return 'green';
          case 'miss':
            return 'orange';
        };
      };

  ctx.clearRect(0,0, ctx.canvas.width,25);
  ctx.font = (actionObj.type === 'miss' ? 'italic' : 'normal') + ' 25px purisa';
  ctx.fillStyle = actionColor(actionObj.type);
  ctx.fillText(actionObj.action, ctx.canvas.width*(actionObj.canv ==='monsterCanvas' ? 0.35 : 0.65), 20);
  ctx.strokeText(actionObj.action, ctx.canvas.width*(actionObj.canv ==='monsterCanvas' ? 0.35 : 0.65), 20);

  setTimeout(function(){
    ctx.clearRect(0,0, ctx.canvas.width,25);
  }, 500);
}

function youHit(hit, monsterHealth)
{
  setTimeout(function(){

    if (monsterHealth > 0)
    {
      animationMonster({
        len: 2,
        path: 'monsterGotHit',
        loop: 3
      });

      actionToCanvas({
        canv:   'monsterCanvas',
        type:   'hit',
        action:  hit
      });
    }
  }, 450);
}

function youMiss()
{
  setTimeout(function(){
    animationYou({
      len: 5,
      path: 'snakeLose',
      loop: 1
    });

   animationMonster({
      len: 4,
      path: 'monsterWin',
      loop: 1
    });

    actionToCanvas({
      canv:   'monsterCanvas',
      type:   'miss',
      action:  'MISS'
    });
  }, 450);
}

function monsterHits(hit, healthSnake)
{
  setTimeout(function(){
    if (healthSnake > 0)
    {
      animationYou({
      len: 8,
      path: 'snakeGotHit',
      loop: false,
      });

      actionToCanvas({
        canv:   'youCanvas',
        type:   'hit',
        action:  hit
        });
    }
  }, 450);
}

function monsterMisses()
{
  setTimeout(function(){
    actionToCanvas({
      canv:   'youCanvas',
      type:   'miss',
      action:  'MISS'
    });
  }, 450);
}