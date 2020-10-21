// Sliding Puzzle - Major Project
// Kassie Tan
// DUE DATE
//
// Extra for Experts:
// - I spent a lot of time working on the visual design of the code
// - my efforts were spent on the UI
// - I (might) continue working on this for my major project by creating some sort of auto-solve function (this is, of course, subject to change)
// 

let gridSize;
let grid;
let gridSolution = [];

let solutionGridSize3, solutionGridSize4, solutionGridSize5;

let sideLength;
let rectRoundEdge;

let widthOffset, heightOffset;

let emptySpaceX, emptySpaceY;
let numberOfInversions;

let startScreen = true;
let winState = false;
let needHelp = false;
let playGame = true; //determines if the user can interact with the gameboard to make moves

let consistentRatio; //the ratio that doesn't change, no matter the gridSize or gridLength
let buttonGap, buttonHeight, buttonWidth, buttonTopBottomOffset;

let montserratSemiBoldFont, domineBoldFont;



let buttonGridSize3, buttonGridSize4, buttonGridSize5;


function preload() {
  //load the fonts
  montserratSemiBoldFont = loadFont("assets/Montserrat-SemiBold.ttf");
  domineBoldFont = loadFont("assets/Domine-Bold.ttf");

  solutionGridSize3 = loadStrings("assets/solution-3.txt");
  solutionGridSize4 = loadStrings("assets/solution-4.txt");
  solutionGridSize5 = loadStrings("assets/solution-5.txt");

  buttonGridSize3 = createButton("3");
  buttonGridSize4 = createButton("4");
  buttonGridSize5 = createButton("5");

}

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(1200, 675); //"ideal" 16:9 aspect ratio

  //determine consistentRatio; number that is used to draw everything and is NOT dependant on the gridSize or gridLength
  if (height <= width) {
    consistentRatio = height/5.5; 
  }
  else {
    consistentRatio = width/5.5;
  }

  rectRoundEdge = consistentRatio / 10; //how rounded the edges are

  //determining dimensions of the "buttons" (title, restart, question buttons)
  findButtonDimensions();
}

function draw() {
  drawBackground();

  if (startScreen) {
    drawBackgroundRect();

    drawGridSizeChooser();
  }

  else {
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
}



function findButtonDimensions() {
  buttonGap = consistentRatio / 10; //gap between buttons beside each other
  buttonHeight = consistentRatio / 1.75; //height of each button
  buttonWidth = consistentRatio / 1.5; //width of each button
  buttonTopBottomOffset = consistentRatio; //the distance between the button and the top/bottom (which ever is closest) 
}




function drawBackgroundRect() { //should i change the name to drawBackgroundRect
  //creates a rectangle that serves as the frame/background for the text on the win screen and instruction screen

  //change draw settings for rectangle
  rectMode(CENTER);
  strokeWeight(consistentRatio / 18); //should be ratio of width or something

  // stroke("#9D4C5A"); THIS WAS THE PINK
  stroke("#45252A");
  fill("#EBBDBC"); 

  //create background rectangle
  rect(width / 2, height / 2, consistentRatio * 4, consistentRatio * 4, rectRoundEdge);
}


function drawGridSizeChooser() {
  stroke("#45252A");
  fill("#45252A");
  textAlign(CENTER, CENTER);
  textFont(domineBoldFont);
  strokeWeight(1);
  textSize(consistentRatio/4);
  text("Choose a Grid Size", width/2, height/2 - consistentRatio);

  let arrayOfButtons = [buttonGridSize3, buttonGridSize4, buttonGridSize5];

  for (let item of arrayOfButtons) {
    //item.position(width/2 - buttonWidth*2, height/2);
    item.class("gridSizeButton");
    item.size(buttonWidth, buttonWidth);
    item.attribute("align","right");
  }

  buttonGridSize3.position(width/2 - buttonWidth*2, height/2);
  buttonGridSize3.mousePressed(startGameGridSize3); //hhhhhhhhhhhhh

  buttonGridSize4.position(width/2 - buttonWidth*0.5, height/2);
  buttonGridSize4.mousePressed(startGameGridSize4);

  buttonGridSize5.position(width/2 + buttonWidth, height/2);
  buttonGridSize5.mousePressed(startGameGridSize5);


}


function turnStringIntoGridSolution(stringFile) {
  let gridSolution = [];

  //convert grid solution (currently a string from .txt file) into a 2d array
  for (let i=0; i<stringFile.length; i++) {
    stringFile[i] = stringFile[i].split(",");
  }

  //loop through the gridSolution and turn the strings into numbers
  for (let y=0; y<gridSize; y++) {
    gridSolution.push([]);
    for (let x=0; x<gridSize; x++) {
      gridSolution[y][x] = int(stringFile[y][x]);
    }
  }

  return gridSolution;

}



function startGameGridSize3() {
  let isSolvable = false; //determines whether or not the randomized game board (2d array) is solvable

  gridSize = 3;
  gridSolution = turnStringIntoGridSolution(solutionGridSize3);

  while (isSolvable === false) {
    grid = createRandomGrid(); //create randomized 2d array for the gameboard
    //grid = [ [1,2,3],[4,5,6],[7,0,8]];  
    findEmptySpace();
    
    isSolvable = isGridSolvable();
    //console.log(isSolvable);

  }

  findSideLength(); //side length of the square tiles
  findOffset();

  hideGridSizeButtons();

  startScreen = false;

}

function startGameGridSize4() {
  let isSolvable = false; //determines whether or not the randomized game board (2d array) is solvable

  gridSize = 4;
  gridSolution = turnStringIntoGridSolution(solutionGridSize4);

  while (isSolvable === false) {
    grid = createRandomGrid(); //create randomized 2d array for the gameboard
    findEmptySpace();

    //sanity check for solvability (requires x/y values of empty space)
    numberOfInversions = countNumberOfInversions();
    isSolvable = isGridSolvable();
    console.log("Solvability is " + isSolvable);
  }

  findSideLength(); //side length of the square tiles
  findOffset();

  hideGridSizeButtons();

  startScreen = false;
}

function startGameGridSize5() {
  let isSolvable = false; //determines whether or not the randomized game board (2d array) is solvable

  gridSize = 5;
  gridSolution = turnStringIntoGridSolution(solutionGridSize5);

  while (isSolvable === false) {
    grid = createRandomGrid(); //create randomized 2d array for the gameboard
    findEmptySpace();

    //sanity check for solvability (requires x/y values of empty space)
    isSolvable = isGridSolvable();
    //console.log(isSolvable);
  }

  findSideLength(); //side length of the square tiles
  findOffset();

  hideGridSizeButtons();

  startScreen = false;
}




function findSideLength() {
  //find the side length of the squares based on the dimensions of the canvas and gridSize

  if (height <= width) {
    sideLength = height/5.5 * 4 / gridSize; //original sideLength = (height / 5.5); i want the same total width (hence *4) but for the respective gridSize (hence /gridSize)
  }
  else {
    sideLength = width/5.5 * 4 / gridSize;
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
    //check all values after some1dArray[i] to see if they are less than some1dArray[i] (that would be 1 inversion)
    for (let j = i; j<some1dArray.length; j++) {

      if (some1dArray[i] > some1dArray[j]) { 
        counter++;
      }
    }
  }
  
  console.log("Number of Inversions is " + counter);
  return counter;
}

function isGridSolvable() {

  if (gridSize % 2 === 1) { //gridSize is 3 or 5
    if (numberOfInversions % 2 === 0) { //number of inversions is even
      return true; //yes it is solvable
    }
  }

  else {  //gridSize is 4


    // COMBINE THIS INTO AN "AND" STATEMENT SO YOU ONLY HAVE ONE "IF"

    if ((emptySpaceY+1) % 2 === 1) { //if the empty space is on an ODD NUMBERED ROW (where the first row is 1)
      console.log("odd row");
      if (numberOfInversions % 2 === 1) { //number of inversions is odd
        console.log("odd inversions");
        return true;
      }
    }

    else { //the empty space is on an EVEN NUMBERED ROW
      console.log("even row");
      if (numberOfInversions % 2 === 0) { //number of inversions is even
        console.log("even inversions");
        return true;
      }
    }
  }

  //if nothing has been returned as true; this permutation is not solvable
  return false;
}






function drawBackground() {
  background("#7A3E48");
  //764145

  drawLinePattern();
}

function drawLinePattern() {
  //draw settings for the line background pattern
  strokeWeight(1);
  stroke("#45252A");
  let forwardSlash = true;

  //draw the line background pattern (does not scale to size of canvas; meant to serve as a consistent "wallpaper")
  let numberOfVerticalIterations = floor(height/20); //floor is important!!
  //ensure that it iterates vertically an even number of times
  if (numberOfVerticalIterations % 2 === 1) {
    numberOfVerticalIterations++;
  } 

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



function drawButtonBoxes() {
  //draw settings for rects
  rectMode(CORNER);
  strokeWeight(sideLength / 25);
  stroke("#45252A");
  fill("#45252A");

  //restart button
  rect(width - buttonWidth, height - buttonTopBottomOffset - buttonHeight, buttonWidth, buttonHeight, rectRoundEdge, 0, 0, rectRoundEdge);
  //upper question button
  rect(width - buttonWidth, height - buttonTopBottomOffset - buttonHeight - buttonHeight - buttonGap, buttonWidth, buttonHeight, rectRoundEdge, 0, 0, rectRoundEdge);

  //draw title boxes
  rect(0, buttonTopBottomOffset, buttonWidth, buttonHeight, 0, rectRoundEdge, rectRoundEdge, 0);
  rect(0, buttonTopBottomOffset + buttonHeight + buttonGap, buttonWidth, buttonHeight, 0, rectRoundEdge, rectRoundEdge, 0);

}

function drawButtonText() {
  //text settings 
  textFont(domineBoldFont);
  textSize(consistentRatio /2.5);
  strokeWeight(consistentRatio / 45);
  stroke("#FBDFDF");
  textAlign(CENTER, CENTER);

  //text for question and restart buttons
  text("?", width - buttonWidth / 2, height - buttonTopBottomOffset - buttonHeight - buttonGap - buttonHeight / 2 - buttonGap / 2);
  text("R", width - buttonWidth / 2, height - buttonTopBottomOffset - buttonHeight / 2 - buttonGap / 2);

  //title text
  text(" " + gridSize, 0, buttonTopBottomOffset - buttonGap / 2, buttonWidth, buttonHeight);
  //textSize(sideLength / 6); //"TILES" must be written smaller in order to "fit" in the button
  text(" ^2", 0, buttonTopBottomOffset + buttonHeight + buttonGap / 2, buttonWidth, buttonHeight);
}



function displayGrid() {
  //draw gameboard frame and background

  //draw settings for gameboard background rectangles
  strokeWeight(0);
  rectMode(CENTER);

  //rectangular gameboard frame 
  fill("#45252A"); //dark burgundy 
  rect(width / 2, height / 2, sideLength * (gridSize * 1.1), sideLength * (gridSize * 1.1), rectRoundEdge); 

  //fill in the gaps from the rounded corners of the gameboard
  fill("#9D4C5A"); //pink (same as stroke colour of each number square on the gameboard)
  rect(width / 2, height / 2, sideLength * (gridSize - 1), sideLength * (gridSize - 1), rectRoundEdge);

  //draw squares (for the numbers) on grid

  //draw setting for the squares on the gameboard
  rectMode(CORNER);
  stroke("#9D4C5A");
  strokeWeight(consistentRatio / 25); 

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // fill("black");
      // rect(x*sideLength, y*sideLength, sideLength, sideLength);
      // rect(x * sideLength + widthOffset, y * sideLength + heightOffset, sideLength, sideLength, rectRoundEdge);

      // create each square "button"
      if (grid[y][x] === gridSolution[y][x]) {
        fill("#EBBDBC"); //deep pink if correct
      }
      else {
        fill("#FBDFDF"); //light pink if incorrect
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
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
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
        errorCounter++;
      }
    }
  }

  if (errorCounter === 0) { //if there are no errors (grid matches gridSolution), then the game is solved
    playGame = false; //to account for the "wait" time

    setTimeout(() => {  
      winState = true; 
    }, 350);
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

  //restart button
  if (mouseX >= width - buttonWidth && mouseX <= width 
    && mouseY >= height - (buttonTopBottomOffset + buttonHeight) && mouseY <= height - buttonTopBottomOffset 
    && !needHelp) { //so user does not accidentally restart (lose progress) while reading instructions

    //create random grid
    let isSolvable = false;
    while (isSolvable === false) {
      grid = createRandomGrid(); //create randomized 2d array for the gameboard
      findEmptySpace();
  
      //sanity check for solvability (requires x/y values of empty space)
      isSolvable = isGridSolvable();
      //console.log(isSolvable);
    }

    //if user has already won the game and wishes to restart the winState will be set to false
    if (winState) {
      winState = false;
    }

    playGame = true;
  }

  //question button
  if (mouseX >= width - buttonWidth && mouseX <= width &&
    mouseY >= height - (buttonTopBottomOffset + buttonHeight + buttonGap + buttonHeight) && 
    mouseY <= height - (buttonTopBottomOffset + buttonHeight + buttonGap)) { 
    
    needHelp = !needHelp; //toggle boolean needHelp which draws/does not draw the help screen
  }
}



function drawWinScreen() {
  drawBackgroundRect(); //the frame/background for the text on the win screen

  //change text settings
  textFont(domineBoldFont);
  stroke("#45252A");
  textSize(consistentRatio);
  strokeWeight(consistentRatio / 10);

  //write text
  text("YOU\nWIN!", width / 2, height / 2);
}

function drawHelpScreen() {
  drawBackgroundRect(); //the frame/background for the text on the instruction screen

  //change text settings
  textFont(domineBoldFont);
  textAlign(CENTER, CENTER);
  fill("#45252A");
  strokeWeight(0);
  textSize(consistentRatio / 6);

  //write instruction text
  text(`CONFUSED?
  
1. Click on the squares surrounding the empty square to move\n
2. The goal is to order the numbers from 1 to ${gridSize*gridSize - 1} with the empty space in the bottom right corner\n
3. Click the R button to restart\n
4. Good luck!

*click on the question mark to exit`, width / 2, height / 2, sideLength * (gridSize-0.5), sideLength * (gridSize-0.5));
}

