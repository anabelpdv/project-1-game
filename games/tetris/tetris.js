let canvas = document.querySelector('#tetris');
let context = canvas.getContext('2d');
canvas.width =480;
canvas.height = 800;



context.scale(40,40);//make the components bigger



const matrix = [
  [0,0,0],
  [1,1,1],
  [0,1,0]
];


/***************************************************************************************************************** */
/***************************************************************************************************************** */
/***************************************************************************************************************** */
/***************************************************************************************************************** */
/****************  Keep working on this later and do kata and review example from lecture ************************ */
/***************************************************************************************************************** */
/***************************************************************************************************************** */
/***************************************************************************************************************** */
/***************************************************************************************************************** */


function collide(arena,player){
  [m, o] = [player.matrix, player.pos];
  for(let y = 0; y < m.length; y++){
    for(let x = 0; x < m[y].length; x++){
      if(m[y][x] !== 0 &&
         (arena[y + o.y] && //better practice use array.length this hecks id the row exits in the arena
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

function draw(){
  //context.fillStyle = "#000";
  context.clearRect(0,0,canvas.width,canvas.height);
  drawMatrix(arena, {x:0, y:0})
  drawMatrix(player.matrix,player.pos);
}

function drawMatrix(matrix, offset){
  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value !==0){
        context.fillStyle = 'blue';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
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
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
function update(time=0){
  const deltaTime = time - lastTime;
  lastTime = time;


  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }
  draw();
  requestAnimationFrame(update)
}

const player = {
  pos:{x:5, y:0,},
  matrix: matrix, 
}
const arena = createMatrix(12,20);

function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena,player)){
    player.pos.x -= dir;
  }
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
    // case 81:
    //   playerRotate(-1);
    // break;
    case 38:
      playerRotate(-1);
    break;
  }
}

update();