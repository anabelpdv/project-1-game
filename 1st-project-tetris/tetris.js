window.onload =()=>{
let canvas = document.querySelector('#tetris');
let context = canvas.getContext('2d');
canvas.width =468;
canvas.height = 780;

context.scale(39,39);//make the components bigger


const backgrounds = [null,null,'images/screen2.jpeg','images/screen3.jpg','images/screen4.jpg','images/screen5.jpg'];
let showScore = document.querySelector('#score > div > p');
let showLevel = document.querySelector('#level > div > p');
let playButton = document.querySelector('#play-button');
let instButton = document.querySelector('#inst-button');
//let audio = new Audio("sounds/Popcorn.mp3");



instButton.onclick = ()=>{
$('#instructions').slideToggle();
}

function slideDownTetris(){
  $("#canvas").slideDown(1150,'linear',()=>{
    $(".panel").slideDown(1300)
  }); 
  
}

function updateScore(){
  player.score++;
  showScore.innerHTML = player.score;
  nextLevel(); 
}
function gameOver(){
  if(player.pos.y ===0){  
    gameOverMessage(); 
    cancelAnimationFrame();
  }
}
function gameOverMessage(){
  context.fillStyle = "white";
  context.font = "1.7px Arial";
  context.fillText("GAME OVER",0.9,9.5);
}

function nextLevel(){
  if((player.score % 10 === 0) && (player.dropInterval > 200)){
    player.level++;
    document.body.style.backgroundImage = `url(${backgrounds[player.level]})`
    player.dropInterval -= 200;
    showLevel.innerHTML = player.level;  
  }
}

function arenaSweep(){
  for(let y = arena.length - 1; y >= 0; y--){
      if(arena[y].every(x => x !== 0)){
       arena.unshift(arena.splice(y,1)[0].fill(0));
        y++;      
        updateScore()
      }
   }
 }


function collide(arena,player){
  [m, o] = [player.matrix, player.pos];
  for(let y = 0; y < m.length; y++){
    for(let x = 0; x < m[y].length; x++){
      if(m[y][x] !== 0 && 
         ((arena.length > (y + o.y)) && //better practice use array.length this hecks id the row exits in the arena
         arena[y + o.y][x + o.x]) !== 0){//this also checks for collsion left right
           return true;
      }
    }
  }
  return false;
}

function createMatrix(w,h){
  const matrix = [];
  while(h--){
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type){
  switch(type){
    case 'T':
      return[
      [0,0,0],
      [1,1,1],
      [0,1,0]
    ];
   case 'O':
      return[
      [2,2],
      [2,2],
    ];
   case 'I':
      return[
      [0,3,0,0],
      [0,3,0,0],
      [0,3,0,0],
      [0,3,0,0],
    ];
   case 'S':
      return[
      [0,4,4],
      [4,4,0],
      [0,0,0]
    ];
  case 'Z':
      return[
      [5,5,0],
      [0,5,5],
      [0,0,0]
    ];
  case 'J':
      return[
      [6,0,0],
      [6,6,6],
      [0,0,0]
    ];
  case 'L':
      return[
      [0,0,7],
      [7,7,7],
      [0,0,0]
    ];
  }
}

function draw(){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawMatrix(arena, {x:0, y:0})
  drawMatrix(player.matrix,player.pos);
}

const colors = ['null','#2E34A6', '#41A69C', '#ABBF0F', '#F27B13','#BF3E0F','#BF046B','#67696B']
function drawMatrix(matrix, offset){
  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value !== 0){
        context.strokeStyle = "black";
        context.lineWidth = 0.04;
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x , y + offset.y, 1,1);
        context.strokeRect(x + offset.x + 0.030,  y + offset.y + 0.02 , 1, 0.98);
      }
    });
  });
}

function merge(arena, player){
  player.matrix.forEach((row,y)=>{
      row.forEach((value,x)=>{
        if(value !== 0){
            arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
  });
}

function playerDrop(){
  player.pos.y++;
  if(collide(arena, player)){
    player.pos.y--;
    merge(arena, player);/***************this might be the place where to change the player****************/ 
    gameOver();
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

let dropCounter = 0;
let lastTime = 0;



function update(time = 0){// time is an argument that the callback function of requestAnimationFrame receives automatically like the event argument

  const deltaTime = time - lastTime;//time interval in milliseconds between frames
  lastTime = time;
  dropCounter += deltaTime;//this eventually adds up to a number greater than the drop inteval and as soon as that is true another player is moved down 1px;
  if(dropCounter > player.dropInterval){
    playerDrop();//move player 1 px
  }
  draw();//draw player in new position and arena too
  
  requestAnimationFrame(update)
}


const pieces = 'TOISZJL';

const player = {
  pos:{x:5, y:0,},
  matrix: createPiece(pieces[pieces.length * Math.random() | 0]),
  score: 0,
  dropInterval:1000,
  level: 1,
}

const arena = createMatrix(12,20);

function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena,player)){
    player.pos.x -= dir;
  }
}

function playerReset(){
  player.matrix= createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  //player.pos.x = (arena.length / 2 | 0) - (player.matrix[0].length/2 | 0)
  player.pos.x = 5;
}

function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length){
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix,dir){
  for(let y = 0; y < matrix.length; y++){
    for(let x = 0; x < y; x++){
        [
          matrix[x][y],
          matrix[y][x]
       ] = [
          matrix[y][x],
          matrix[x][y]
      ];
    }
  }
  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  }else{
    matrix.reverse();
  }
}

window.onkeydown =(e)=>{
  switch(e.keyCode){
    case 37:
      playerMove(-1);
      break;
    case 39:
      playerMove(1);
      break;
    case 40:
      playerDrop();
      break;
    case 38:
      playerRotate(-1);
    break;
  }
}
playButton.onclick = ()=>{
  document.getElementsByClassName("control")[0].style.display = 'none'; 
  slideDownTetris();
  //audio.play();
  update();
  };

}