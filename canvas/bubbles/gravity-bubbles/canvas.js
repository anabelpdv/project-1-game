let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = {
  x: innerWidth/2,
  y: innerHeight/2,
}
//colors for balls
let colors = [
  '#F2059F',
  '#05DBF2',
  '#04D94F',
  '#F2CB05',
  '#F28705'
]
let gravity = 1;
let friction = 0.95;

window.onmousemove = (e)=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

window.onresize = ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
}

window.onclick =()=>{
  init();//restart animation 
}

function randomIntegerFromRange(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor (colors){
  return Math.floor(Math.random() * (colors.length))
}


class Ball{
  constructor(x, y, dx, dy, radius, color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }
  update(){
    if(this.y + this.radius + this.dy > canvas.height){
      this.dy = -this.dy * friction;
      /* at the bottom of the canvas reverse velocity making it negative 
      * by multiplying it by friction make the velocity a bit smaller every time it is reversed
      * dy needs to be included since it effectively makes the ball touch the bottom even when the y + radius
      * do not add up to it in the current state.
      */
    }else{
      this.dy += gravity;
      /* increment velocity if ball is going down or decrement velocity if ball is going up
      * when velocity reaches 0 the ball stops and velocity starts building up again in the
      * positive direction (down). Gravity is the amount by which the velocity is incremented
    */
    }

    if(this.x + this.radius > canvas.width ||
      this.x - this.radius <= 0){
        /* if either the left or right side of the ball (borders) touches 
         * the border of the canvas reverse velocity */ 
      this.dx = -this.dx;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
  draw(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  }
}

let ball;
let ballArray = [];


function init(){
  ballArray = [];
  for(let i = 0; i < 300; i++){
    let radius = randomIntegerFromRange(8,20);
    let x = randomIntegerFromRange(radius,canvas.width - radius);
    let y = randomIntegerFromRange(0,canvas.height - radius);
    let dx = randomIntegerFromRange(-2,2)
    let dy = randomIntegerFromRange(-2,2)
    let color = colors[randomColor(colors)]
    ballArray.push(new Ball(x, y, dx, dy, radius, color))
  }
}

function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#404040";
  c.fillRect(0, 0, canvas.width, canvas.height);
  ballArray.forEach((ball)=>{
  ball.update();
  });

}

init();
animate();