// 16 Squares - Sliding Puzzle
// Kassie Tan
// October 9th, 2020
//
// Extra for Experts:
// - I spent a lot of time working on the visual design of the code
// - my efforts were spent on the UI
// - I (might) continue working on this for my major project by creating some sort of auto-solve function (this is, of course, subject to change)


const GRIDSIZE = 4;
let grid;
let gridSolution = 
  [[1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]];

let sideLength;
let rectRoundEdge;

let widthOffset, heightOffset;

let emptySpaceX, emptySpaceY;

let winState = false;
let needHelp = false;

let buttonGap, buttonHeight, buttonWidth, buttonTopBottomOffset;

let montserratSemiBoldFont, domineBoldFont;


function preload() {
  //load the fonts
  montserratSemiBoldFont = loadFont("assets/Montserrat-SemiBold.ttf");
  domineBoldFont = loadFont("assets/Domine-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = createRandomGrid(); //create randomized 2d array for the gameboard

  findSideLength(); //side length of each square

  rectRoundEdge = sideLength / 10; //how rounded the edges are

  //find the offset values to centre the grid in the middle of the canvas
  widthOffset = width/2 - sideLength*2;
  heightOffset = height/2 - sideLength*2;

  //determining dimensions of the "buttons" (title, restart, question buttons)
  findButtonDimensions();
}

function draw() {
  drawBackground();

  //draw the buttons (title, restart, question)
  drawButtonBoxes();
  drawButtonText();

  if (!winState) {
    //create game board
    displayGrid();
    displayNumbers();

    //find the coordinates of the empty space
    findEmptySpace();

    checkForWin();
  }
  else {
    //win screen is drawn if winState is true (game is won)
    drawWinScreen();
  }

  if (needHelp) {
    //boolean needHelp is triggered by clicking the questionButton
    drawHelpScreen();
  }
}



function createRandomGrid() {
  let listOfNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let randomGrid = [];
  let someIndex; //local variable to randomize the order of numbers in the 2d array

  for (let i = 0; i < 4; i++) {
    randomGrid.push([]);

    for (let j = 0; j < 4; j++) {
      //choose a  value from the listOFNumbers with a random index value to push into the randomGrid
      someIndex = floor(random(listOfNumbers.length));
      randomGrid[i].push(listOfNumbers[someIndex]);

      //remove the value at someIndex from the array of possible values (listOfNumbers) as to not add it twice
      listOfNumbers.splice(someIndex, 1);
    }
  }

  return randomGrid;
}



function findSideLength() {
  //find the side length of the squares based on the dimensions of the canvas

  if (height <= width) {
    sideLength = height / 5;
  }
  else {
    sideLength = width / 5;
  }
}

function findButtonDimensions() {
  buttonGap = sideLength / 15.5; //gap between buttons beside each other
  buttonHeight = sideLength / 2; //height of each button
  buttonWidth = sideLength / 1.75; //width of each button
  buttonTopBottomOffset = buttonHeight * 1.25; //the distance between the button and the top/bottom (which ever is closest) 
}



function drawBackground() {
  background("#764149");

  drawLinePattern();

  drawGameboardFrame();
}

function drawLinePattern() {
  //draw settings for the line background pattern
  strokeWeight(sideLength / 150);
  stroke("#45252A");
  let forwardSlash = true;

  //draw the line background pattern (does not scale to size of canvas; meant to serve as a consistent "wallpaper")
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      if (forwardSlash === true) {
        line(x, y, x + 5, y + 5);
      }
      else {
        line(x + 5, y, x, y + 5);
      }
      forwardSlash = !forwardSlash;
    }
    forwardSlash = !forwardSlash;
  }
}

function drawGameboardFrame() {
  //draw settings for gameboard background rectangles
  strokeWeight(0);
  rectMode(CENTER);

  //rectangular gameboard frame 
  fill("#45252A");
  rect(width / 2, height / 2, sideLength * 4.3, sideLength * 4.3, rectRoundEdge); 

  //fill in the gaps from the rounded corners of the gameboard
  fill("#9D4C5A");
  rect(width / 2, height / 2, sideLength * 3, sideLength * 3, rectRoundEdge);
}



function drawButtonBoxes() {
  //draw settings for rects
  rectMode(CORNER);
  strokeWeight(sideLength / 25);
  stroke("#45252A");
  fill("#45252A");

  //draw title boxes
  rect(0, buttonTopBottomOffset, buttonWidth, buttonHeight, 0, rectRoundEdge, rectRoundEdge, 0);
  rect(0, buttonTopBottomOffset + buttonHeight + buttonGap, buttonWidth, buttonHeight, 0, rectRoundEdge, rectRoundEdge, 0);

  //restart button
  rect(width - buttonWidth, height - buttonTopBottomOffset - buttonHeight, buttonWidth, buttonHeight, rectRoundEdge, 0, 0, rectRoundEdge);
  //upper question button
  rect(width - buttonWidth, height - buttonTopBottomOffset - buttonHeight - buttonHeight - buttonGap, buttonWidth, buttonHeight, rectRoundEdge, 0, 0, rectRoundEdge);
}

function drawButtonText() {
  //text settings 
  textFont(domineBoldFont);
  textSize(sideLength / 3);
  strokeWeight(sideLength / 45);
  stroke("#F7D0CC");
  textAlign(CENTER, CENTER);

  //text for question and restart buttons
  text("?", width - buttonWidth / 2, height - buttonTopBottomOffset - buttonHeight - buttonGap - buttonHeight / 2 - buttonGap / 2);
  text("R", width - buttonWidth / 2, height - buttonTopBottomOffset - buttonHeight / 2 - buttonGap / 2);

  //title text
  text(" 16", 0, buttonTopBottomOffset - buttonGap / 2, buttonWidth, buttonHeight);
  textSize(sideLength / 7); //"SQUARES" must be written smaller in order to "fit" in the button
  text("SQUA\nRES !", 0, buttonTopBottomOffset + buttonHeight + buttonGap / 2, buttonWidth, buttonHeight);
}



function displayGrid() {
  //draw setting for the squares on the gameboard
  rectMode(CORNER);
  stroke("#9D4C5A");
  strokeWeight(sideLength / 25); 

  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {

      //create each square "button"
      if (grid[y][x] === gridSolution[y][x]) {
        fill("#EEADA6"); //deep pink if correct
      }
      else {
        fill("#F7D0CC"); //light pink if incorrect
      }
      rect(x * sideLength + widthOffset, y * sideLength + heightOffset, sideLength, sideLength, rectRoundEdge);

    }
  }
}

function displayNumbers() {
  //set text style settings for the numbers on the gameboard 
  fill("#562F35");
  stroke("#45252A");
  strokeWeight(sideLength / 30); 
  textFont(montserratSemiBoldFont);
  textSize(sideLength / 2);
  textAlign(CENTER, TOP);

  //iterate through the 2d array (grid) and draw the values on the gameboard
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
      if (grid[y][x] !== 0) { //the value 0 in the 2d array (grid) is the empty space on the board
        text(grid[y][x],
          x * sideLength + widthOffset + sideLength / 16,
          y * sideLength + heightOffset + sideLength / 5,
          sideLength, sideLength);
      }
    }
  }
}



function findEmptySpace() {
  //because the grid variable is a 2d array, we cannot use indexOf() to find the 0 value

  //iterate through the grid to find the 0 value; set its X and Y coordinates in the 2d array
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
      if (grid[y][x] === 0) {
        emptySpaceY = y;
        emptySpaceX = x;
      }
    }
  }
}

function checkForWin() {
  let errorCounter = 0;

  //compare the grid (user-interacted 2d array) and gridSolution
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
      if (grid[y][x] !== gridSolution[y][x]) {
        errorCounter++;
      }
    }
  }

  if (errorCounter === 0) { //if there are no errors (grid matches gridSolution), then the game is solved
    winState = true;
  }
}



function mousePressed() {

  //when the game is not won yet, user can make moves by clicking squares by the empty space
  if (winState === false) {

    //RIGHT square is clicked/moved
    if (mouseX >= (emptySpaceX+1)*sideLength + widthOffset && mouseX <= (emptySpaceX+2)*sideLength + widthOffset &&
      mouseY >= emptySpaceY*sideLength + heightOffset && mouseY <= (emptySpaceY+1) * sideLength + heightOffset) {

      //change the empty square into the NON-ZERO value
      grid[emptySpaceY][emptySpaceX] = grid[emptySpaceY][emptySpaceX + 1];

      //change the pressed square INTO ZERO (empty square)
      emptySpaceX += 1; //adjust the x-coordinate of the empty space
      grid[emptySpaceY][emptySpaceX] = 0;
    }

    //LEFT square is clicked/moved
    if (mouseX >= (emptySpaceX-1)*sideLength + widthOffset && mouseX <= emptySpaceX*sideLength + widthOffset &&
      mouseY >= emptySpaceY*sideLength + heightOffset && mouseY <= (emptySpaceY+1) * sideLength + heightOffset) {
      
      //change the empty square into the NON-ZERO value
      grid[emptySpaceY][emptySpaceX] = grid[emptySpaceY][emptySpaceX - 1];

      //change the pressed square INTO ZERO
      emptySpaceX -= 1; //adjust the x-coordinate of the empty space
      grid[emptySpaceY][emptySpaceX] = 0;
    }

    //UPPER square is clicked/moved
    if (mouseX >= emptySpaceX*sideLength + widthOffset && mouseX <= (emptySpaceX+1)*sideLength + widthOffset &&
      mouseY >= (emptySpaceY-1)*sideLength + heightOffset && mouseY <= emptySpaceY*sideLength + heightOffset) {
      
      //change the empty square into the NON-ZERO value
      grid[emptySpaceY][emptySpaceX] = grid[emptySpaceY - 1][emptySpaceX];

      //change the pressed square INTO ZERO
      emptySpaceY -= 1; //adjust the y-coordinate of the empty space
      grid[emptySpaceY][emptySpaceX] = 0;
    }

    //LOWER square is clicked/moved
    if (mouseX >= emptySpaceX*sideLength + widthOffset && mouseX <= (emptySpaceX+1)*sideLength + widthOffset &&
      mouseY >= (emptySpaceY+1)*sideLength + heightOffset && mouseY <= (emptySpaceY+2)*sideLength + heightOffset) {
      
      //change the empty square into the NON-ZERO value
      grid[emptySpaceY][emptySpaceX] = grid[emptySpaceY + 1][emptySpaceX];

      //change the pressed square INTO ZERO
      emptySpaceY += 1; //adjust the y-coordinate of the empty space
      grid[emptySpaceY][emptySpaceX] = 0;
    }

  }

  //restart button
  if (mouseX >= width - buttonWidth && mouseX <= width 
    && mouseY >= height - (buttonTopBottomOffset + buttonHeight) && mouseY <= height - buttonTopBottomOffset 
    && !needHelp) { //so user does not accidentally restart (lose progress) while reading instructions

    grid = createRandomGrid(); //create a new randomized gameboard

    //if user has already won the game and wishes to restart the winState will be set to false
    if (winState) {
      winState = false;
    }
  }

  //question button
  if (mouseX >= width - buttonWidth && mouseX <= width &&
    mouseY >= height - (buttonTopBottomOffset + buttonHeight + buttonGap + buttonHeight) && 
    mouseY <= height - (buttonTopBottomOffset + buttonHeight + buttonGap)) { 
    
    needHelp = !needHelp; //toggle boolean needHelp which draws/does not draw the help screen
  }
}



function drawWinScreen() {
  drawWinHelpRect(); //the frame/background for the text on the win screen

  //change text settings
  textFont(domineBoldFont);
  stroke("#45252A");
  textSize(sideLength);
  strokeWeight(sideLength / 10);

  //write text
  text("YOU\nWIN!", width / 2, height / 2);
}

function drawHelpScreen() {
  drawWinHelpRect(); //the frame/background for the text on the instruction screen

  //change text settings
  textFont(domineBoldFont);
  textAlign(CENTER, CENTER);
  fill("#45252A");
  strokeWeight(0);
  textSize(sideLength / 6);

  //write instruction text
  text(`CONFUSED!? (Me too)
  
1. Click on the squares surrounding the empty square to move\n
2. The goal is to order the numbers from 1 to 15 with the empty space in the bottom right corner\n
3. Click the R button to restart\n
4. Good luck!

*click on the question mark to exit`, width / 2, height / 2, sideLength * 3, sideLength * 3);
}

function drawWinHelpRect() {
  //creates a rectangle that serves as the frame/background for the text on the win screen and instruction screen

  //change draw settings for rectangle
  rectMode(CENTER);
  strokeWeight(sideLength / 25); //should be ratio of width or something

  stroke("#9D4C5A");
  fill("#EEADA6");

  //create background rectangle
  rect(width / 2, height / 2, sideLength * 4, sideLength * 4, rectRoundEdge);
}