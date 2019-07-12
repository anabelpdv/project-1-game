let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



let mouse = { // creating an object with x and y coordinates to model the mouse
  x: undefined,
  y: undefined,
}

let maxRadius = 40; 
let minRadius = 2;
let numberCircles = 600;


//color pallet for cicles
let colorArray = [
  '#A84F01',
  '#4C0015',
  '#C8D1BC',
  '#030A28',
  '#8EB8E5'
];

// assign mouse coordinates to mouse object's coordinates
window.onmousemove = (e)=>{
  mouse.x = e.x;
  mouse.y = e.y;
}

// the entire animation will be redrawn base on the new size of the windows.
window.onresize=()=>{
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
    this.minRadius = radius;
    this.color = color;
    
  }

  draw(){//draw circle with constructor-passed information;
    c.beginPath();
    c.arc(this.x,this.y, this.radius, 0, Math.PI*2, false);
    c.fillStyle = this.color;
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

    if(mouse.x - this.x < 50 && mouse.x - this.x > -50 // every circle to the right of the mouse but no farther than 50px;
      && mouse.y - this.y < 50 && mouse.y - this.y > -50){//every circle above of the mouse but no farther than 50px;
      if(this.radius < maxRadius){//circles that have not reached the maximum radius
        this.radius +=1; //increment radius by 1px;
      }
    }else if(this.radius > this.minRadius){//circles that have reached maximum radius
      this.radius -=1; // decrement radius by 1px;
    }

    this.draw();//redraw with new properties
  } 
}



let circleArray = []; //array to store each of the circles that will be drawn

function init(){ // create a new array full of circles

  circleArray.length = 0; // empty the array to avoid having more than the desired
                          // number of circles when this function is called more than once

  for(let i = 0; i < numberCircles; i++){//with each iteration a new cirle is created.
    let radius = Math.random() * 4 + 1;
    let color = colorArray[(Math.floor(Math.random()* colorArray.length))];
    let x = Math.random() * (innerWidth - radius * 2) + radius;//subtract the diameter and add radius to a avoid bubbles getting stuck on the margins
    let y = Math.random() * (innerHeight - radius * 2) + radius;//subtract the diameter and add radius to a avoid bubbles getting stuck on the margins
    let dx = (Math.random() - 0.5) * 3; //subtract 0.5 to obtain positive and negative numbers
    let dy = (Math.random() - 0.5) * 3; //subtract 0.5 to obtain positive and negative numbers
    circleArray.push(new Circle(x,y,dx,dy,radius,color)) //create circle object and push it to the array
}
}

init();

function animate(){//create each frame
  requestAnimationFrame(animate);  
  c.clearRect(0,0,innerWidth,innerHeight);//clear the canvas 
  circleArray.forEach((eachCircle)=>eachCircle.update())//draw each of the objects that were pushed into the circlesArray.
}

animate();