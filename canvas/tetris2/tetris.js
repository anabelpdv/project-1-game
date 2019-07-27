let canvas =  document.querySelector('canvas');
let context = canvas.getContext('2d');


canvas.width = 240;
canvas.height = 400;

context.scale(20,20)




function getMatrix(height,width){
    const matrix = [];
        while(height > 0){
          matrix.push(new Array(width).fill(0))
          height--;
        }
    return matrix;
}


function clearLines(matrix){
  for(let y = matrix.length - 1; y >= 0; y--){
   if(matrix[y].every((value)=>{
return value !==0;
    })){
     matrix.unshift(matrix.splice(y,1)[0].fill(0));
     y++;
    }
  }
}


class Tetris{
  constructor(height,width){
    this.width = width;
    this.height = height;
    this.matrix = this.getMatrix();
  }


getMatrix(){
    const matrix = [];
        while(this.height > 0){
          matrix.push(new Array(this.width).fill(0))
          this.height--;
        }
    return matrix;
}
 clearLines(){
  for(let y = this.matrix.length - 1; y >= 0; y--){
   if(this.matrix[y].every((value)=>{
return value !==0;
    })){
     this.matrix.unshift(this.matrix.splice(y,1)[0].fill(0));
     y++;
    }
  }
}
landTetromino(player){
  player.matrix.forEach((row,y) => {
    row.forEach((value,x) =>{ 
      if(value !== 0){
        this.matrix[y + player.pos.y][x + player.pos.x] = value;
      }      
    });
  }); 
}

}



let tetris = getMatrix(20,12);


let player = {
  pos:{y: 0, x:4},
  matrix: [
    [0,0,0],
    [1,1,1],
    [0,1,0],
   
  ]
};


function landTetromino(tetris,player){
  player.matrix.forEach((row,y) => {
    row.forEach((value,x) =>{ 
      if(value !== 0){
        tetris[y + player.pos.y][x + player.pos.x] = value;
      }      
    });
  }); 
}

/*
* the collision functions uses truthy and falsy values to do the check 
* case 1: row does not exist the expression is TRUE && (FALSE) !== 0 since false is not equal to 0 the whole expression is true.
* case 2: col does not exist the expression is TRUE && (FALSY) !== 0 since falsy is not equal to 0 the whole expression is true.
* case 3: cell is not empty the expression is TRUE && (TRUTHY) !== 0 since falsy is not equal to 0 the whole expression is true.
* case 4: cell is empty the expression is TRUE && [(TRUTHY && 0)/(0)] !==0 since 0 is equal to 0 the whole expression is false and there is no collision.
* Order of precedence is important in this case so parenthesis matter.
 */
function collision(tetris,player){
  for(let y = 0; y < player.matrix.length; y++){
    for(let x = 0; x < player.matrix[y].length; x++){
      if(player.matrix[y][x] !== 0 &&
        ((tetris.length > (y + player.pos.y)) &&
         tetris[y + player.pos.y][x + player.pos.x]) !== 0){
            return true;                                    
          }
        }
      }
    return false;
}

function draw(matrix,position){
  matrix.forEach((row,y) => {
    row.forEach((value,x) => {
      if(value !== 0){
          context.fillStyle = 'red';
          context.fillRect(x + position.x, y + position.y, 1, 1)
      }      
    });
  });
}


let lastTime = 0;
let dropInterval = 1000;
let timeInterval = 0;

function update(time = 0){

    let deltaTime = time - lastTime;
    lastTime = time;
    timeInterval += deltaTime;
    if(timeInterval > dropInterval){
        dropPlayer(player);
        timeInterval = 0;
    }
    context.fillStyle = 'black';
    context.fillRect(0,0,canvas.width,canvas.height)

    draw(player.matrix, player.pos);
    draw(tetris, {y:0, x:0})
   
  requestAnimationFrame(update);
}


function dropPlayer(player){
  player.pos.y +=1;

  if(collision(tetris,player)){
    player.pos.y -=1;
    landTetromino(tetris,player)
    clearLines(tetris);
    player.pos.y = 0;
  }
}

function movePlayer(dir){
  player.pos.x +=dir;
  if(collision(tetris,player)){
   player.pos.x -= dir;
  }
}


function transpose(matrix){
  for(let y = 0; y < matrix.length; y++){
    for(let x = 0; x < y; x++){
        [matrix[x][y],
        matrix[y][x]]
         = 
        [matrix[y][x],
        matrix[x][y]]
    }
  }
}

function rotatePlayer(matrix,dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(matrix, dir);
  while(collision(tetris,player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ?  1 : -1))

    if(offset > matrix[0].length){
      rotate(matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir){
  transpose(matrix);
  if(dir < 0){
    matrix.reverse();
  }else{
    matrix.forEach((row)=>{
        row.reverse();
    });
  }
}



window.onkeydown = (e) => {
  switch(e.keyCode){
        case 37:
         movePlayer(-1);
        break;
        case 39:
         movePlayer(1);
        break;
        case 38:
          rotatePlayer(player.matrix,1);
        break;
        case 40:
         dropPlayer(player);
        break;
    }
}


update();