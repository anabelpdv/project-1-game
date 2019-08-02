window.onload =()=>{
let canvas = document.querySelector('#tetris');
let context = canvas.getContext('2d');
canvas.width =468;
canvas.height = 780;
let animateLoop = true;//Control frames generation
context.scale(39,39);//Scale the canvas so that each pixel is 39 times bigger
let isOver = false;//Control game over message printing

/* Array containing the backgrounds that are dynamically updated as the levels change */ 
const backgrounds = [null,null,'images/screen2.jpeg','images/screen3.jpg','images/screen4.jpg','images/screen5.jpg'];
let showScore = document.querySelector('#score');
let showLines = document.querySelector('#lines');
let showLevel = document.querySelector('#level');
let showTime = document.querySelector('#time');
let showNext = document.querySelector('#tetromino-image');
let playButton = document.querySelector('#play-button');
let instButton = document.querySelector('#inst-button');
let backgroundAudio = new Audio("sounds/Popcorn.mp3");
let landingTetrominoAudio = new Audio("sounds/falling-tetromino.mp3");
let flippingTetrominoAudio = new Audio("sounds/flipping-tetromino.mp3");

instButton.onclick = () => {
$('#instructions').slideToggle();//animate instructions panel
}

function slideDownTetris(){//animate all the panels the comprise the game and that are shown after user clicks PLAY button
  $("#canvas").slideDown(1150,'linear',()=>{
    $(".panel").slideDown(1300)
  });  
}

/* updateScore: add 1 to the score and update the DOM. The score is based on the amount of frames */ 
function updateScore(){
  showScore.innerHTML = tetromino.score++/100|0;// Divide by 100 and floor the score to make it a smaller whole number 
}

let lineCounter = 0;//count the lines that are cleared

/* updateScore: add 1 to the lineCounter and update the DOM. At the end call nextLevel function to
 check if it's possible to go to the next level */ 
function updateLines(){
  showLines.innerHTML = ++lineCounter;
  nextLevel(); 
}

let level = 1; //first level of the game

/* nextLevel: check if the number of lines is the minimum required to go to the next level. The 
dropInterval needs to be greater than 200 to guarantee that the the speed of the falling tetromino will never
be faster than 1/200ms */ 
function nextLevel(){
  if((lineCounter % 2 === 0) && (tetromino.dropInterval > 200)){
    level++;//if the previous conditions are met go to next level
    document.body.style.backgroundImage = `url(${backgrounds[level]})`//change background
    tetromino.dropInterval -= 200;//decrease interval so the tretomino drops faster;
    showLevel.innerHTML = level;  //update the DOM with new level;
  }
}


/* gameOverMessage: print game over message */ 
function gameOverMessage(){
  context.fillStyle = "white";
  context.font = "1.7px Arial";
  context.fillText("GAME OVER",0.8,9.5);
}

/* class Tetris: represents the container where the tetrominoes will drop and land */ 
class Tetris{
  constructor(height,width){
    this.width = width;
    this.height = height;
    this.matrix = this.getMatrix();
  }
/* getMatrix: returns a matrix of the height and width specified when a tretis object is created */
  getMatrix(){
      const matrix = [];
          while(this.height > 0){
            matrix.push(new Array(this.width).fill(0))//create new row and fill it with zeros
            this.height--;
          }
      return matrix;
  }
  collision(tetromino){
    for(let y = 0; y < tetromino.matrix.length; y++){
      for(let x = 0; x < tetromino.matrix[y].length; x++){
        if(tetromino.matrix[y][x] !== 0 &&
          ((this.matrix.length > (y + tetromino.pos.y)) &&
          this.matrix[y + tetromino.pos.y][x + tetromino.pos.x]) !== 0){
              return true;                                    
            }
          }
        }
      return false;
  }
  /* clearLines: scans the matrix from the bottom up and as soon as it encounters a line that is completely filled 
   * deletes it and adds an empty line at the top. The splice() remove the desired line and returns it. Then fill() fills
   * it with zeros and finally unshift() adds it at the top of the matrix
   */
  clearLines(){
    for(let y = this.matrix.length - 1; y >= 0; y--){
        if(this.matrix[y].every((value) => value !==0)){
            this.matrix.unshift(this.matrix.splice(y,1)[0].fill(0));
            y++;
            updateLines();
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

function pauseTetris(){
  if(animateLoop){
    animateLoop = false;
    backgroundAudio.pause( );
  }else if(!animateLoop){
    animateLoop = true;
    backgroundAudio.play();
    update();
  }
}

const tetrominoes = [null,'images/T.png','images/O.png','images/I.png','images/S.png','images/Z.png','images/L.png','images/J.png']
function nextPreview(matrix){
  matrix.forEach((row,y) => {
    row.forEach(value => {
    if (value!==0){
      showNext.style.backgroundImage = `url(${tetrominoes[value]})`;
    }
    });
  });
}

function getTetromino(){
  const tetrominoes = [
         [[1,1,1],
          [0,1,0],
          [0,0,0]]
        ,
         [[2,2],
          [2,2]]
        , 
         [[0,3,0,0],
          [0,3,0,0],
          [0,3,0,0],
          [0,3,0,0]]
        ,
         [[0,4,4],
          [4,4,0],
          [0,0,0]]
        ,
         [[5,5,0],
          [0,5,5],
          [0,0,0]]
        ,
         [[6,0,0],
          [6,6,6],
          [0,0,0]]
        ,
         [[0,0,7],
          [7,7,7],
          [0,0,0]]
        ,
      ]; 
    return tetrominoes[randomNumber(0,tetrominoes.length-1)];
}

function randomNumber(start,end){
  return Math.floor(Math.random()*(end - start +1) + start);
}

const colors = ['null','#2E34A6', '#41A69C', '#ABBF0F', '#F27B13','#BF3E0F','#BF046B','#67696B'];

function drawMatrix(matrix, position){
  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value !== 0){
        context.strokeStyle = "black";
        context.lineWidth = 0.04;
        context.fillStyle = colors[value];
        context.fillRect(x + position.x , y + position.y, 1,1);
        context.strokeRect(x + position.x + 0.030,  y + position.y + 0.02 , 1, 0.98);
      }
    });
  });
}

function drawTetris(){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawMatrix(tetromino.matrix,tetromino.pos);
  drawMatrix(tetris.matrix, {x:0, y:0})
}

function gameOver(){
  if(tetromino.pos.y === 0){
    animateLoop = false;
    isOver = true;
    backgroundAudio.pause();
  }
}

function dropTetromino(){
  tetromino.pos.y += 1;
  if(tetris.collision(tetromino)){
    tetromino.pos.y -= 1;
    landingTetrominoAudio.play();
    tetris.landTetromino(tetromino);
    gameOver();
    nextTetromino();
    tetris.clearLines();
   }
  dropCounter = 0;
}

let startTime, endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  let timeDiff = endTime - startTime; 
  let timeDiffSeconds = timeDiff/1000;
  let mins = Math.floor(timeDiffSeconds/60);
  let seconds = Math.floor(timeDiffSeconds-(mins * 60));

  if(seconds < 10){
    seconds = '0' + seconds;
  }
  return `${mins}:${(seconds)}`;
}

let timeInterval = 0;
let lastTime = 0;

function update(time = 0){
  let timeDiff = time - lastTime;
  lastTime = time;
  timeInterval += timeDiff;
  if(timeInterval > tetromino.dropInterval){
    dropTetromino();
    timeInterval = 0;
  }
  updateScore();
  drawTetris();
  showTime.innerHTML = end();

  if(animateLoop){
    requestAnimationFrame(update);
  }
  if(isOver){
    gameOverMessage();
  }
}

let currentMatrix = getTetromino();

function nextTetromino(){
  let nextMatrix = getTetromino();
  nextPreview(nextMatrix);
  tetromino.matrix = currentMatrix;
  currentMatrix = nextMatrix;
  tetromino.pos.y = 0;
  tetromino.pos.x = 5;
}


const tetromino = {
  matrix: currentMatrix,
  pos:{x:5, y:0},
  score: 0,
  dropInterval:1000,
}

nextTetromino();


let tetris = new Tetris(20,12);

function moveTetromino(direction){
  tetromino.pos.x += direction;
  if(tetris.collision(tetromino)){
    direction = -direction;
    tetromino.pos.x += direction;
  }
}

function rotateTetromino(direction){
  const startPos = tetromino.pos.x;
  let diff = 1;
  rotate(tetromino.matrix, direction);
  while(tetris.collision(tetromino)){
    tetromino.pos.x += diff;
    diff = -(diff+ (diff > 0 ? 1 : -1));
    if(diff > tetromino.matrix[0].length){
      rotate(tetromino.matrix, -direction);
      tetromino.pos.x = startPos;
      return;
    }
  }
}

function transpose(matrix){
  for(let y = 0; y < matrix.length; y++){
    for(let x = 0; x < y; x++){
      [matrix[y][x], matrix[x][y]] = [matrix[x][y], matrix[y][x]];
    }
  }
}

function rotate(matrix,dir){
  flippingTetrominoAudio.volume = 0.5;
  flippingTetrominoAudio.play();
  transpose(matrix);
  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  }else{
    matrix.reverse();
  }
}

window.onkeydown =(e)=>{
  switch(e.keyCode){
    case 32:
      pauseTetris();
       break;
    case 37:
      moveTetromino(-1);
      break;
    case 39:
      moveTetromino(1);
      break;
    case 40:
      dropTetromino();
      break;
    case 38:
      rotateTetromino(-1);
    break;
  }
}

playButton.onclick = () => {
    document.getElementsByClassName("control")[0].style.display = 'none'; 
    start();
    slideDownTetris();
    backgroundAudio.loop = true;
    backgroundAudio.play();
    update();
};

}