let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

window.onresize =()=>{
  canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
init();
}


class Circle {//prototype of each circle
  constructor(x,y,dx,dy,radius,color){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw(){//draw circle with constructor-passed information;
    c.beginPath();
    c.arc(this.x,this.y, this.radius, 0, Math.PI*2, false);
    c.fillStyle =this.color
    c.fill();
  } 

  update(){//update coordinates and redraw
    if((this.x + this.radius) > innerWidth || (this.x - this.radius) < 0){
      this.dx = -this.dx; // bounce back on x direction
    } 
    if((this.y + this.radius) > innerHeight || (this.y - this.radius) < 0){
      this.dy = -this.dy; // bounce back on y direction
    } 
    this.x += this.dx;//change x coordinate according to specified speed
    this.y += this.dy;//change x coordinate according to specified speed
    this.draw();
  } 
}

let circleArray = []; //array to store each of the circles that will be drawn
function init(){
 
  circleArray.length =0;
  
  for(let i = 0; i < 90; i++){//with each iteration a new cirle is created.
      let radius = innerHeight/15;
      let color = `rgb(${Math.random() * 255 + 99}, ${Math.random() * 170 + 52},${Math.random() * 208 + 1},0.5)`;
      let x = Math.random() * (innerWidth - radius * 2) + radius;//subtract the diameter and add radius to a avoid bubbles getting stuck on the margins
      let y = Math.random() * (innerHeight - radius * 2) + radius;//subtract the diameter and add radius to a avoid bubbles getting stuck on the margins
      let dx = (Math.random() - 0.5) * 4; //subtract 0.5 to obtain positive and negative numbers
      let dy = (Math.random() - 0.5) * 4; 
      circleArray.push(new Circle(x,y,dx,dy,radius,color))
  }

}


init();

function animate(){
  requestAnimationFrame(animate);  
  c.clearRect(0,0,innerWidth,innerHeight);
  circleArray.forEach((eachCircle)=>eachCircle.update())
}

animate();