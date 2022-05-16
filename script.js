var canvas = document.getElementById("myCanvas");//we're storing a reference to the <canvas> element to the canvas variable
var ctx = canvas.getContext("2d");//ctx variable to store the 2D rendering context — the actual tool we can use to paint on the Canvas.
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;//a small value to x and y after every frame has been drawn to make it appear that the ball is moving.
var dy = -2;

var hex;
var color = chColor();

var paddleHeight = 10;// define width and height of the paddle 
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2; //starting point X axis

var rightPressed = false;//two variables for storing info on whether the left or right button pressed
var leftPressed = false;//at the beginning buttons are not pressed so value is false

// variables to define information about the bricks such as their width and height, rows and columns, etc
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
//the padding between the bricks so they won't touch each other and a top and left offset 
//so they won't start being drawn right from the edge of the Canvas.
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];//two-dimensional array
//it will contain the brick columns (c), which in turn will contain the brick rows (r), 
//which in turn will each contain an object containing the x and y position to paint each brick on the screen.

//to listen for key presses
document.addEventListener("keydown", keyDownHandler, false); //when key on keyboard is pressed
document.addEventListener("keyup", keyUpHandler, false); //when key on keyboard stops being pressed
document.addEventListener("mousemove", mouseMoveHandler, false);//listening for mouse movement

function keyDownHandler(e){ //when key is pressed down, storing this info in variable
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = true;//relevant var in each case is set to true
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = true;//relevant var in each case is set to true
  }
}

function keyUpHandler(e){//when the key is released, the var is set back to false
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  } else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = false;
  }
}



function mouseMoveHandler(e){//update the paddle position based on the pointer coordinates
  var relativeX = e.clientX - canvas.offsetLeft;
  /* equal to the horizontal mouse position in the viewport (e.clientX) minus the distance between the left edge of the canvas 
  and left edge of the viewport (canvas.offsetLeft) — 
  effectively this is equal to the distance between the canvas left edge and the mouse pointer*/
  if(relativeX > 0 && relativeX < canvas.width){
    paddleX = relativeX - paddleWidth/2; //is within the Canvas boundaries, and the paddleX position is set to the relativeX value minus half the width of the paddle
  }
}

function collisionDetection(){//loop through all the bricks and compare every single brick's position with the ball's coordinates as each frame is drawn
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      var b = bricks[c][r];//b variable for storing the brick object in every loop of the collision detection
      if(b.status == 1){//if the brick is active (its status is 1) we will check whether the collision happens
      if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
          /*The x position of the ball is greater than the x position of the brick.
          The x position of the ball is less than the x position of the brick plus its width.
          The y position of the ball is greater than the y position of the brick.
          The y position of the ball is less than the y position of the brick plus its height.*/
          dy = -dy;//we'll change the direction of the ball
          b.status = 0;//if a collision does occur we'll set the status of the given brick to 0 so it won't be painted on the screen
          score++;//score+1 each time brick is hit
          if(score == brickRowCount*brickColumnCount){
            alert("YOU WIN, CONGATS");
            document.location.reload();//function reloads the page and starts the game again once the alert button is clicked
          }
      }
      }
    }
  }
}

function drawScore(){
    ctx.font = "15px serif";
    ctx.fillStyle = "#770000";
    ctx.fillText("Score: " + score, 20, 20);
}

function drawLives() {
  ctx.font = "15px serif";
  ctx.fillStyle = "#006600";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

for(var c=0; c<brickColumnCount; c++){//loop through the rows and columns and create the new bricks
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++){
    bricks[c][r] = { x: 0, y: 0, status: 1 }; //status as an extra parameter to indicate whether we want to paint each brick on the screen or not
  }
}

function drawBall() {//drawing ball
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {//drawing paddle on the screen
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#453645";
  ctx.fill();
  ctx.closePath();
}

function drawBricks(){//loop through all the bricks in the array and draw them on the screen
  for(var c=0; c<brickColumnCount; c++){//we're looping through the rows and columns to set the x and y position of each brick
    for(var r=0; r<brickRowCount; r++){
      if(bricks[c][r].status == 1){//if status is 1, then draw brick, but if it's 0, then it was hit by the ball
      var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;//brickX position is worked out as brickWidth + brickPadding, multiplied by the column number, c, plus the brickOffsetLeft
      var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;//for the brickY is identical except that it uses the values for row number, r, brickHeight, and brickOffsetTop
    bricks[c][r].x = brickX;
    bricks[c][r].y = brickY;
    ctx.beginPath();
    ctx.rect(brickX, brickY, brickWidth, brickHeight);//painting a brick on the Canvas — size brickWidth x brickHeight — with each loop iteration
    ctx.fillStyle= "#9E4B9E";
    ctx.fill();
    ctx.closePath();
      }
      }
    }
}

function chColor() {//changing color each time ball hits walls of the canvas
        hex = Math.floor(Math.random() * 100000 + 1);
        color = convertToColor(hex);
        return color;
      }

      function convertToColor(num){
      return '#' + ('00000' + (num | 0).toString(16)).substr(-6);
      }

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();


    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {//ball bounce of the walls
    dx = -dx;//ball will be painted in the new position on every update
    color = chColor();
    }
    if(y + dy < ballRadius) {//ball bounce of the walls
    dy = -dy;//the ball will be painted in the new position on every update
    color = chColor();
    }

     else if(y + dy > canvas.height-ballRadius) {//when the ball colliding with the bottom edge of the canvas
      //If the ball hits the bottom edge of the Canvas
      //check whether it hits the paddle
      if(x > paddleX && x < paddleX + paddleWidth){//if yes, then it bounces off just like you'd expect
        dy = -dy;
      }
      else {
        lives--; 
        if(!lives) {//if not, then the game is over
        alert("GAME OVER");//game is over
        document.location.reload(); //reloading page
    }
        else {
      /*if there are still some lives left, then the position of the ball and the paddle are reset, 
      along with the movement of the ball.*/
      x = canvas.width/2;
      y = canvas.height-30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width-paddleWidth)/2;
    }
    }
  }


    if(rightPressed && paddleX < canvas.width-paddleWidth){ //if the left cursor pressed, the paddle will move 7px to the left
      paddleX += 7;
        //paddleX position we're using will move between 0 on the left side 
        //of the canvas and canvas.width-paddleWidth on the right-hand side
      
    }
    else if(leftPressed && paddleX > 0){//same but to the right
      paddleX -= 7; 
      }
      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }


draw();//The draw() function will be executed within setInterval every 10 milliseconds: