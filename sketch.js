// Sliding Puzzle - Major Project
// Kassie Tan
// October 27th, 2020
//
// 
// SOURCES
// 1. CSS Fade-in Effect on hover
//  - https://www.w3schools.com/css/tryit.asp?filename=trycss_buttons_fade
//
// 2. Explanations for Tile Game Solvability
// - https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
// - https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html 
// 
// 3. Explanations for Template Literals (adding expressions in multi-line strings)
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals 
//
// 4. Using setTimeout() 
// - https://www.sitepoint.com/delay-sleep-pause-wait/ 



let gridSize;
let grid;
let gridSolution = [];

let solutionGridSize3 = [[1,2,3],[4,5,6],[7,8,0]];
let solutionGridSize4 = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
let solutionGridSize5 = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,0]];

let consistentRatio; //the ratio that doesn't change, no matter the gridSize or gridLength
let sideLength;
let rectRoundEdge;

let widthOffset, heightOffset;

let emptySpaceX, emptySpaceY;

let startScreen = true;
let winState = false;
let needHelp = false;
let playGame = false; //determines if the user can interact with the gameboard to make moves

let buttonGap, buttonLength, buttonTopBottomOffset, buttonTextSize;
let buttonGridSize3, buttonGridSize4, buttonGridSize5;
let questionButton, shuffleButton, restartButton;

let montserratSemiBoldFont, domineBoldFont;





function preload() {
  //load fonts
  montserratSemiBoldFont = loadFont("assets/Montserrat-SemiBold.ttf");
  domineBoldFont = loadFont("assets/Domine-Bold.ttf");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(1200, 675); //"ideal" 16:9 aspect ratio; prevents any "overlap" of elements

  findConsistentRatio();

  rectRoundEdge = consistentRatio / 10; //how rounded the edges are

  //determining dimensions of the "buttons" (title, shuffle, question buttons)
  findButtonDimensions();

  //create button elements
  createGridSizeButtons(); //buttons to choose the size of the grid
  createQuestionShuffleButtons(); //button elements for help/instructions and shuffling the gameboard
}



function draw() {
  drawBackground();
  drawBackgroundRect();

  if (startScreen) {
    drawStartScreen();
  }

  else { //game has started
    if (!winState) {
      //display the game board
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
}




function findConsistentRatio() {
  //determine consistentRatio; number that is used to draw everything and is NOT dependant on the gridSize or gridLength
  if (height <= width) {
    consistentRatio = height/6; 
  }
  else {
    consistentRatio = width/6;
  }
}

function findButtonDimensions() {
  buttonGap = consistentRatio / 10; //gap between buttons beside each other
  buttonLength = consistentRatio / 1.5; //width of each button
  buttonTopBottomOffset = consistentRatio / 2; //the distance between the button and the top/bottom (which ever is closest)
  
  buttonTextSize = buttonLength/2;
}




function createGridSizeButtons() {
  //creates the buttons that are used to select/change the gridSize

  //create, position on the canvas, and add mousePressed functions to the button elements

  buttonGridSize3 = createButton("3");
  buttonGridSize3.position(width/2 - buttonLength*2, height/2 + consistentRatio/3);
  buttonGridSize3.mousePressed(startGameGridSize3);

  buttonGridSize4 = createButton("4");
  buttonGridSize4.position(width/2 - buttonLength*0.5, height/2 + consistentRatio/3);
  buttonGridSize4.mousePressed(startGameGridSize4);

  buttonGridSize5 = createButton("5");
  buttonGridSize5.position(width/2 + buttonLength, height/2 + consistentRatio/3);
  buttonGridSize5.mousePressed(startGameGridSize5);

  //stylizing the button elements for choosing grid size
  for (let someButton of [buttonGridSize3, buttonGridSize4, buttonGridSize5]) {
    someButton.hide(); //this is important in preventing a "delay" in loading the CSS property (?)

    someButton.class("gridSizeButton");
    someButton.size(buttonLength, buttonLength); //square-shaped buttons

    //css style settings (scale to canvas size)
    someButton.style("font-size", buttonTextSize + "px");
    someButton.style("border", buttonTextSize/7 + "px solid #45252A");
    someButton.style("border-radius", buttonTextSize/3 + "px");

    someButton.show();
  }
}

function createQuestionShuffleButtons() {
  //creates user interactive buttons to show the help screen or shuffle the gameboard (same grid size)

  //create the question button element
  questionButton = createButton("?");
  questionButton.position(width - buttonLength - buttonGap, height - buttonTopBottomOffset - buttonLength - buttonLength - buttonGap);
  questionButton.mousePressed(toggleNeedHelp); //question button triggers the help/instructions screen

  //create shuffle button element
  shuffleButton = createButton("S");
  shuffleButton.position(width - buttonLength - buttonGap, height - buttonTopBottomOffset - buttonLength);
  shuffleButton.mousePressed(shuffleGameboard); //"S" shuffle button shuffles the game board (with same grid size)

  //stylize question and shuffle buttons
  for (let someButton of [questionButton, shuffleButton]) {
    someButton.hide(); //buttons created upon setup(); not needed in the start screen so must be hidden
    someButton.class("gameButton");
    someButton.size(buttonLength, buttonLength);

    someButton.style("font-size", buttonTextSize + "px");
    someButton.style("border", buttonTextSize/7 + "px solid #45252A");
    someButton.style("border-radius", buttonTextSize/3 + "px");

  }

}

function createRestartButton() {
  //create and hide restartButton
  restartButton = createButton(gridSize + "\262");
  restartButton.hide(); //this is important in preventing a "delay" in loading the CSS property (?)

  //stylize and add mousePressed
  restartButton.class("gameButton");
  restartButton.position(buttonGap, buttonTopBottomOffset);
  restartButton.size(buttonLength, buttonLength);

  //css style attributes (scale to canvas size)
  restartButton.mousePressed(returnToStartScreen);

  restartButton.style("font-size", buttonTextSize + "px");
  restartButton.style("border", buttonTextSize/7 + "px solid #45252A");
  restartButton.style("border-radius", buttonTextSize/3 + "px");

  restartButton.show();
}




function drawBackground() {
  background("#7A3E48");
  drawLinePattern();
}

function drawLinePattern() {
  //draw the line background pattern (does not scale to size of canvas; meant to serve as a consistent "wallpaper")
  
  //draw settings for the line background pattern
  strokeWeight(1);
  stroke("#45252A");
  let forwardSlash = true;

  let numberOfVerticalIterations = floor(height/20); //determines number of times the "slash" is drawn vertically

  //ensure that it iterates vertically an EVEN number of times
  if (numberOfVerticalIterations % 2 === 1) {
    numberOfVerticalIterations++;
  } 

  //draw the "slash" pattern
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < numberOfVerticalIterations; y++) {
      if (forwardSlash === true) {
        line(x, y*20, x + 5, y*20 + 5);
      }
      else {
        line(x + 5, y*20, x, y*20 + 5);
      }
      forwardSlash = !forwardSlash;
    }
    forwardSlash = !forwardSlash;
  }
}




function drawStartScreen() {
  //style settings for text
  stroke("#45252A");
  fill("#45252A");
  textAlign(CENTER, CENTER);
  textFont(domineBoldFont);

  strokeWeight(1);
  textSize(consistentRatio/4);
  text("NUMBER SLIDER GAME", width/2, height/2 - consistentRatio*1);

  strokeWeight(0);
  textSize(consistentRatio/6);
  text("Choose a Grid Size!", width/2, height/2 - consistentRatio/6);
}

function drawBackgroundRect() { 
  //draws a rectangle that serves as the frame/background for the text on the win screen and instruction screen and start screen

  //draw larger, darker rectangle frame first
  //style settings for large rectangle
  rectMode(CENTER);
  strokeWeight(0);
  stroke("#45252A");
  fill("#45252A");

  rect(width/2, height/2, consistentRatio*4.4, consistentRatio*4.4, rectRoundEdge);

  //drawing a smaller rectangle
  //change draw settings for smaller rectangle
  strokeWeight(consistentRatio / 18);
  stroke("#9D4C5A");
  fill("#EBBDBC"); //light pink

  rect(width / 2, height / 2, consistentRatio * 4, consistentRatio * 4, rectRoundEdge);
}



function startGameGridSize3() {
  gridSize = 3;
  gridSolution = solutionGridSize3;
  startGameGridSize();
}

function startGameGridSize4() {
  gridSize = 4;
  gridSolution = solutionGridSize4;
  startGameGridSize();
}

function startGameGridSize5() {
  gridSize = 5;
  gridSolution = solutionGridSize5;
  startGameGridSize();
}

function startGameGridSize() {
  let isSolvable = false; //determines whether or not the randomized game board (2d array) is solvable

  while (isSolvable === false) {
    grid = createRandomGrid(); //create randomized 2d array for the gameboard
    findEmptySpace();
    
    //sanity check for solvability (requires x/y values of empty space)
    isSolvable = checkSolvability();  
  }

  findSideLength(); //side length of the square tiles
  findOffset(); //find offset values to centre the game board vertically and horizontally

  //hide/show/create button elements to prepare for game board
  hideGridSizeButtons(); 
  showGameButtons();
  createRestartButton();

  startScreen = false;
  playGame = true;
}




function createRandomGrid() {
  let listOfNumbers = []; 
  let randomGrid = [];
  let someIndex; //local variable to randomize the order of numbers in the 2d array

  //create a list of all possible numbers (from 0 to N^2-1 where N=gridSize)
  for (let i=0; i< gridSize*gridSize; i++) {
    listOfNumbers.push(i); 
  }

  for (let i = 0; i < gridSize; i++) {
    randomGrid.push([]);

    for (let j = 0; j < gridSize; j++) {
      //choose a  value from the listOFNumbers with a random index value to push into the randomGrid
      someIndex = floor(random(listOfNumbers.length));
      randomGrid[i].push(listOfNumbers[someIndex]);

      //remove the value at someIndex from the array of possible values (listOfNumbers) as to not add it twice
      listOfNumbers.splice(someIndex, 1);
    }
  }

  return randomGrid;
}

function countNumberOfInversions() {
  let counter = 0; //variable to count the number of inversions
  let some1dArray = [];

  //turn the 2d array into a 1d array
  for (let y=0; y<gridSize; y++) {
    for (let x=0; x<gridSize; x++) {
      if (grid[y][x] !== 0) { //do not insert 0 (empty space) into the array because it does not count as an inversion
        some1dArray.push(grid[y][x]); 
      }
    }
  }
  
  for (let i=0; i<some1dArray.length; i++) {
    //check all values after some1dArray[i] to see if they are less than some1dArray[i] (that would be one inversion)
    
    for (let j = i+1; j<some1dArray.length; j++) {
      if (some1dArray[i] > some1dArray[j]) { 
        counter++;
      }
    }
  }
  
  return counter;
}

function checkSolvability() {
  let numberOfInversions;

  numberOfInversions = countNumberOfInversions();

  console.log(numberOfInversions);

  if (gridSize % 2 === 1) { 
    //gridSize is 3 or 5 and number of inversions is even

    return numberOfInversions % 2 === 0; //number of inversions must be even to be solvable
  }

  else if (gridSize % 2 === 0) {
    //grid size is even (4)
    
    if ((emptySpaceY+1) % 2 === 1) {
      //ODD-rowed empty space needs an ODD number of inversions to be solvable
      return numberOfInversions % 2 === 1;
    }

    else {
      //EVEN-rowed empty space needs an EVEN number of inversions
      return numberOfInversions % 2 === 0;
    }
  }

}




function findSideLength() {
  //find the side length of the squares based on the dimensions of the canvas and gridSize

  if (height <= width) {
    sideLength = height/6 * 4 / gridSize; //original sideLength = (height / 5.5); i want the same total width (hence *4) but for the respective gridSize (hence /gridSize)
  }
  else {
    sideLength = width/6 * 4 / gridSize;
  }
}

function findOffset() {
  //find the offset values to centre the grid in the middle of the canvas
  widthOffset = width/2 - sideLength*(gridSize/2);
  heightOffset = height/2 - sideLength*(gridSize/2);
}





function hideGridSizeButtons() {
  buttonGridSize3.hide();  
  buttonGridSize4.hide();
  buttonGridSize5.hide();
}

function showGridSizeButtons() {
  buttonGridSize3.show();
  buttonGridSize4.show();
  buttonGridSize5.show();
}

function hideGameButtons() {
  questionButton.hide();
  shuffleButton.hide();
  restartButton.hide();
}

function showGameButtons() {
  questionButton.show();
  shuffleButton.show();
}




function displayGrid() {
  //draw gameboard frame and background

  //fill in the gaps from the rounded corners of the tiles
  rectMode(CENTER);
  stroke("#45252A");
  fill("#9D4C5A"); //pink (same as stroke colour of each number square on the gameboard)
  rect(width / 2, height / 2, sideLength * gridSize, sideLength * gridSize, rectRoundEdge);


  //draw setting for the squares on the gameboard
  rectMode(CORNER);
  stroke("#9D4C5A");
  strokeWeight(consistentRatio / 25); 

  //draw squares (for the numbers) by iterating through the 2d array
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {

      //change the fill colour of the tile depending on if it is in the correct spot
      if (grid[y][x] === gridSolution[y][x]) {
        fill("#EBBDBC"); //dark pink if correct
      }
      else {
        fill("#FBDFDF"); //light pink if incorrect
      }

      //draw each square tile
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
  rectMode(CORNER);

  //iterate through the 2d array (grid) and draw the values on the gameboard
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] !== 0) { //the value 0 in the 2d array (grid) is the EMPTY space on the board
        text(grid[y][x],
          x * sideLength + widthOffset + sideLength/16,
          y * sideLength + heightOffset + sideLength/5,
          sideLength, sideLength);
      }
    }
  }
}




function mousePressed() {

  //when the game is not won yet, user can make moves by clicking squares by the empty space
  if (winState === false && playGame === true) {

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
}




function findEmptySpace() {
  //side note: because the grid variable is a 2d array, we cannot use indexOf() to find the 0 value

  //iterate through the grid to find the 0 value; set its X and Y coordinates in the 2d array
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
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
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] !== gridSolution[y][x]) {
        //any coinciding x,y values that do not match up are an error
        errorCounter++;
      }
    }
  }

  if (errorCounter === 0) { //if there are no errors (grid matches gridSolution), then the game is solved
    playGame = false; //to account for the "wait" time before the win screen is drawn

    //"wait" time so user has time to see their puzzle solution before win screen is drawn
    setTimeout(() => { 
      winState = true; 
    }, 350);
  }
}




function shuffleGameboard() {
  //randomly shuffle the tiles with the SAME gridSize

  if (! needHelp) { //so user does not accidentally shuffle while reading instructions
    
    //create random grid
    let isSolvable = false; //sanity check boolean; records whether or not the randomzied grid is solvable

    while (isSolvable === false) {
      grid = createRandomGrid(); //create randomized 2d array for the gameboard

      findEmptySpace(); //find the x,y coordinates of the empty space

      //sanity check for solvability (requires x/y values of empty space)
      isSolvable = checkSolvability();
    }

    //if user has already won the game and wishes to shuffle the winState set to false and playGame set to true so that the player may play again
    if (winState) {
      winState = false;
    }
    playGame = true;
  }
}

function toggleNeedHelp() {
  needHelp = !needHelp; //toggle boolean needHelp which draws/does not draw the help screen
}

function returnToStartScreen() { 
  startScreen = true;
  winState = false;
  playGame = false;
  needHelp = false;

  hideGameButtons();
  showGridSizeButtons();
}




function drawWinScreen() {

  //change text settings
  textFont(domineBoldFont);
  textAlign(CENTER, CENTER);
  stroke("#45252A");
  fill("#FBDFDF");
  textSize(consistentRatio);
  strokeWeight(consistentRatio / 10);

  //write text
  text("YOU\nWIN!", width / 2, height / 2);
}

function drawHelpScreen() {
  drawBackgroundRect(); //call the function again to draw over the game board tiles to show the instruction text

  //change text settings
  textFont(domineBoldFont);
  textAlign(CENTER, CENTER);
  fill("#45252A");
  strokeWeight(0);
  textSize(consistentRatio /6.5);

  //write instruction text
  text(`CONFUSED?
  
1. Click on the squares surrounding the empty square to move\n
2. The goal is to order the numbers from 1 to ${gridSize*gridSize - 1} with the empty space in the bottom right corner\n
3. Click the S button to shuffle the board\n
4. Click the ${gridSize + "\262"} button to change the grid size \n
GOOD LUCK!

*click on the question mark to exit`, width / 2, height / 2, sideLength * (gridSize-0.5), sideLength * (gridSize-0.5));
}

