

/****************************** myGameArea ******************************** 
* Object that represents the game area.
* property canvas: calls the createElement method of the document object to create a canvas tag
* property start: sets the width and height of the canvas object and inserts it in the html body
* and also gets the 2d context for the canvas.
* clear property: function that clears the canvas.
*/ 
let myGameArea = {
  canvas: document.createElement("canvas"),
  frames:0,
  start: function(){
    this.canvas.width =window.innerWidth; //canvas width
    this.canvas.height = window.innerHeight; // canvas height

    this.context = this.canvas.getContext("2d");//get the context that was created before
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    //insert the canvas inside the body of the document
    this.interval = setInterval(updateGameArea,20);
  },
  clear: function() {
    //using the canvas width and height clear the canvas element.
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    
  },
  stop: function(){
      clearInterval(this.interval);
  },
};
/**************************** Componen Class *************************
 * This class creats a new component for the canvas. To create an instance of this class width 
 * height, and position of the component must be provided.
 * property update: is a function that creates a component with the information obtained by the constructor
 * and places it on the canvas.
*/
class Component {
  constructor(width, height,color,x,y){
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x; // x positio of any element created with this class
    this.y = y; //y position of any element created with this class
    this.speedX = 0; // when this number is added to the x coordinate and image is redraw gives the ilusion of speed
    this.speedY = 0;// the component position will vary by this amount on each frame

  }

  update(){//this method adds the component to the canvas
    myGameArea.context.fillStyle = this.color;//add style to the context
    myGameArea.context.fillRect(this.x,this.y,this.width,this.height)// create a rectangle with the information obtained by the constructor
  }

  newPos(){//this method updates the position of the component on the canvas
    this.x += this.speedX;
    this.y += this.speedY;
  }
  left(){
    return this.x;
  }
  right(){
  return this.x + this.width;
  }
  top(){
    return this.y;
  }
  bottom(){
    return this.y + this.height;
  }
  crashWith(obstacle){
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}
/**************************** updateGame *************************
 * This function calls the clear method of the myGameArea object to clear the canvas element
 * and call the update function of the player object to actually add the player to the canvas after its
 * position has been change. It also the obstacles.
 */

function updateGameArea(){
  myGameArea.clear(); //clear the canvas
  player.newPos(); // move player
  player.update(); //draw player in new position
  updateObstacles();// draw obstacles in new position;
  checkGameOver();
  
 
}

let myObstacles = [];

/**************************** updateObstacles  *************************
 * This function creates a new obstacle every 120 frames. After that is puches the 
 * new obstacles to the obstacles array and then iterates throu the array to 
 * modify the x value of each obstacle and make it look like it is moving.
 */
function updateObstacles(){
// after updateGameArea has drawn 120 frames (has been called 120 times) a new pair of obstacles is created
myGameArea.frames += 1 ; // each time the updateGameArea function is called it draws a new frame
  if(myGameArea.frames % 140 === 0){
    let x = myGameArea.canvas.width;
    let minHeight = 100;
    let maxHeight = 390;
    let height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);

    let minGap = 50;
    let maxGap = 100;
    let gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);

    myObstacles.push(new Component(10, height, "purple", x, 0));
    myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    //the height of the bottom obstacle is going to be the total height of the
    //canvas - the height of the up obstacle - the gap
  }

  for(i = 0; i < myObstacles.length; i++){
    myObstacles[i].x -= 1; //move the obstacles along the x axis
    myObstacles[i].update(); // add the obstacle to the canvas
  }
  
}

function checkGameOver(){
  let crashed = myObstacles.some((obstacle)=>{//check the array of obstacles
    return player.crashWith(obstacle);//find the first crash and return true otherwise return false
  });
  if(crashed){//if thre is a crash stop the game
    myGameArea.stop();
  }
}

//instanciate Component class to crate a player.
let player = new Component(30,30,"red",0,110);


myGameArea.start();


document.onkeydown = function(e){
  switch(e.keyCode){
    case 37: 
    player.speedX -= 1; 
    break;
    case 38: 
    player.speedY -= 1; 
    break;
    case 39: 
    player.speedX += 1; 
    break;
    case 40: 
    player.speedY += 1;
    break;
    case 32: 
    player.x = 70;
    player.y =30;
    break;
  }

};

document.onkeyup = function(e){
player.speedX = 0;
player.speedY = 0;
}

console.log( myObstacles )