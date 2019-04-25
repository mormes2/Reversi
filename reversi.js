
// ------- Game ------- //
// Game class is root of the tree. It contains 2 players (black & white), a board and the current turn
function Game(){
    console.log("game", this);
    let winning =  document.getElementById("wining");
    this.element = document.createElement("div");
    this.element.classList.add("display-board");
    document.activeElement.appendChild(this.element);

    this.turn = "black";
    this.player1 = new Player("black");
    this.player2 = new Player("white");
    this.gameBoard = new Board(this.element, this);
    this.endByClick = false;
    this.numberOfMoves = 0;

    let checkbox = document.getElementById("myCheck");
    checkbox.onclick = this.gameBoard.paintValidCells.bind(this.gameBoard);

    // ------- Statistics & Buttons Section ------- //

    // Stop button
    let endButton = document.createElement("button");
    endButton.setAttribute("id", "endGameButton");
    endButton.innerHTML = "Stop Game";
    document.activeElement.appendChild(endButton);
    document.getElementById("endGameButton").addEventListener("click", endGameByClick);

    // Restart button
    let restartButton = document.createElement("button");
    restartButton.setAttribute("id", "restartButton");
    restartButton.innerHTML = "Restart Game";
    document.activeElement.appendChild(restartButton);
    document.getElementById("restartButton").addEventListener("click", restartGameByClick);

    document.activeElement.appendChild(winning);

    let stats = document.createElement("div");
    stats.classList.add("stats");
    document.activeElement.appendChild(stats);

}



// ------- Players ------- //
// Player class contains the color of the player's disc and it's score //
function Player(color) {
    this.color = color;
    this.score = 2;
    this.playernumberOfMoves = 0;
    this.evgTime = 0;
    this.startTime = new Date();
    this.have2discs = 1;
}

// ------- Board ------- //
// Board class creates the board and initiate it. The board is the child of game
function Board(parent, game) {
    this.element = document.createElement("div");
    this.element.classList.add("board");
    parent.appendChild(this.element);
    this.buildBoard(game);
    this.initBoard(game);
}


// ------- Cell ------- //
// Cell class contains x and y coordinates, a status that sets to free. Each cell doesn't contains a disc
// Cell is the child of the Board
function Cell(x, y, parent) {
    this.element = document.createElement("div");
    this.element.classList.add("cell");
    this.disc = null;
    this.element.setAttribute("X", x);
    this.element.setAttribute("Y", y);
    this.element.setAttribute("status","free");
    parent.appendChild(this.element);
}

// ------- Disc ------- //
// Disc class contains the disc color. The disc is the child of the Cell
function Disc(color, parent) {
    this.color = color;
    this.element = document.createElement("div");
    this.element.classList.add("disc");
    this.element.classList.add(color);
    parent.appendChild(this.element);
}

// ------- Prototypes ------- //
// This function adds a new disc to a given cell & updates the cell status to taken
Cell.prototype.newDisc = function(color){
    console.log("adding a new disc");
    this.disc = new Disc(color, this.element);
    this.element.setAttribute("status", "taken");
};

// This function builds the game board
Board.prototype.buildBoard = function(game){
    this.playZone = new Array(10);
    for (let i = 0; i < 10; i++) {
        this.playZone[i] = new Array(10);
        for (let j = 0; j < 10; j++) {
            this.playZone[i][j] = new Cell(i, j, this.element);
            this.playZone[i][j].element.onclick = Game.prototype.move.bind(game);
        }
    }
};


// Clearing the board to initiate a new game
Game.prototype.clearBoard = function() {
    console.log("Clear board");

    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            console.log("removing disc");
            if (this.gameBoard.playZone[i][j].element.getAttribute("status") === "taken"){
                this.gameBoard.playZone[i][j].disc.element.classList.remove("disc", "white", "black");
                this.gameBoard.playZone[i][j].element.setAttribute("status", "free");
                this.gameBoard.playZone[i][j].element.setAttribute("disc", "null");
            }
        }
    }

    this.gameBoard.initBoard();
    game.endByClick = false;
    let bodyStyle = document.getElementsByClassName("display-board")[0];
    let winningMsg = document.getElementById("wining");

    winningMsg.classList.remove("modal-content");
    winningMsg.classList.add("hidden");
    bodyStyle.classList.remove("endgameBody");

    //Reset Players
    this.resetPlayers();

    this.numberOfMoves = 0;
    clock.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
    timer();
    this.updateStatistics();
    };


// This function resets the black and white players's statistics once the "New game" option was selected
Game.prototype.resetPlayers= function()
{
    //Reset black player parameters:
    this.player1.evgTime = 0;
    this.player1.score=2;
    this.player1.startTime = new Date();
    this.player1.playernumberOfMoves = 0;

    let avgTimeBlack = document.getElementById("avgTimeBlack");
    avgTimeBlack.textContent = "Average Time: 0 sec";

    //Reset black player parameters:
    this.player2.evgTime = 0;
    this.player2.score = 2;
    this.player2.startTime = new Date();
    this.player2.playernumberOfMoves = 0;

    let avgTimeWhite = document.getElementById("avgTimeWhite");
    avgTimeWhite.textContent = "Average Time: 0 sec";
};


// This function initiate the board, placing 2 black discs and 2 white discs at the center of the board
Board.prototype.initBoard = function(game){
    console.log("initiating board");
    this.playZone[4][5].newDisc("black");
    this.playZone[4][4].newDisc("white");
    this.playZone[5][4].newDisc("black");
    this.playZone[5][5].newDisc("white");
    this.paintValidCells(game);
};

Board.prototype.paintValidCells = function()
{
    console.log("paint");
    let x = document.getElementById("myCheck");
    console.log(x.checked);

    for(let i=0; i<10; i++)
    {
        for (let j=0; j<10; j++)
        {
            if(this.isValidCell(i,j))
            {
                if(x.checked)
                {
                    //console.log("Potential discs for:"+ game.turn+ " " + i + " , " + j);
                    let total_nn  =  this.potentialDiscs(game.turn, i, j,-1,0);
                    console.log("Potential nn", total_nn);
                    let total_ne  =  this.potentialDiscs(game.turn, i, j,-1,1);
                    console.log("Potential ne", total_ne);
                    let total_nw  =  this.potentialDiscs(game.turn, i, j,-1,-1);
                    console.log("Potential nw", total_nw);
                    let total_ee  =  this.potentialDiscs(game.turn, i, j,0,1);
                    console.log("Potential ee", total_ee);
                    let total_ww  =  this.potentialDiscs(game.turn, i, j,0,-1);
                    console.log("Potential ww", total_ww);
                    let total_ss  =  this.potentialDiscs(game.turn, i, j,1,0);
                    console.log("Potential ss", total_ss);
                    let total_se  =  this.potentialDiscs(game.turn, i, j,1,1);
                    console.log("Potential se", total_se);
                    let total_sw  =  this.potentialDiscs(game.turn, i, j,1,-1);
                    console.log("Potential se", total_sw);

                    let total_flipped = total_nn+ total_ne + total_nw + total_ee + total_ww + total_ss + total_se +total_sw ;
                    console.log("Potential total flip", total_flipped);
                    this.playZone[i][j].element.innerHTML = "<span style=\"font-family:Impact\">" + total_flipped +"</span>";
                    this.playZone[i][j].element.classList.add("validCell");
                    this.playZone[i][j].element.classList.remove("inValidcell");
                }

                else
                {
                    this.playZone[i][j].element.innerHTML = "";
                    this.playZone[i][j].element.classList.add("validCell");
                    this.playZone[i][j].element.classList.remove("inValidcell");
                }

            }

            else
            {
                this.playZone[i][j].element.classList.add("inValidcell");
                this.playZone[i][j].element.classList.remove("validCell");

            }

            if(this.playZone[i][j].element.getAttribute("status") === "free" && this.playZone[i][j].element.classList.contains("inValidcell"))
               this.playZone[i][j].element.innerHTML = "";
        }
    }
};



//This function manage the game process, every click that each of the players use is being "translated" to an action.
Game.prototype.move = function (event) {

    if(!this.endByClick)
    {
        console.log(event);
        console.log("the current player is" , this.turn);
        console.log(event.target.getAttribute("status"));
        let x = event.target.getAttribute("x");
        let y = event.target.getAttribute("y");
        console.log(this.gameBoard.isValidCell(x, y));
        if (this.gameBoard.isValidCell(x, y, this.turn))
        {
            this.gameBoard.playZone[x][y].element.innerHTML = "";
            this.gameBoard.playZone[x][y].newDisc(this.turn, x, y);
            this.gameBoard.playZone[x][y].element.classList.remove("validCell");
            this.gameBoard.playZone[x][y].element.classList.add("inValidcell");

            let total_nn  =  this.gameBoard.flipDisc(this.turn, x, y,-1,0);
            let total_ne  =  this.gameBoard.flipDisc(this.turn, x, y,-1,1);
            let total_nw  =  this.gameBoard.flipDisc(this.turn, x, y,-1,-1);
            let total_ee  =  this.gameBoard.flipDisc(this.turn, x, y,0,1);
            let total_ww  =  this.gameBoard.flipDisc(this.turn, x, y,0,-1);
            let total_ss  =  this.gameBoard.flipDisc(this.turn, x, y,1,0);
            let total_se  =  this.gameBoard.flipDisc(this.turn, x, y,1,1);
            let total_sw  =  this.gameBoard.flipDisc(this.turn, x, y,1,-1);
            let total_flipped = total_nn+ total_ne + total_nw + total_ee + total_ww + total_ss + total_se +total_sw ;

            if(this.turn === "black")
            {
                this.player1.playernumberOfMoves++;
                this.player1.score++; // The disc that added
                this.player1.score += total_flipped ;
                console.log("total black score" ,this.player1.score);
                this.player2.score -= total_flipped;
                console.log("total white score" ,this.player2.score);
                if(this.player1.score===2)
                    this.player1.have2discs++;
            }
            else{ // if the current player is white
                this.player2.playernumberOfMoves++;
                this.player2.score++; // The disc that added
                this.player2.score += total_flipped ;
                console.log("total white score" ,this.player2.score);
                this.player1.score -= total_flipped;
                console.log("total black score" ,this.player1.score);
                if(this.player2.score===2)
                    this.player2.have2discs++;
            }
            this.numberOfMoves++;
            this.updateStatistics();
            this.changeTurn();
            this.gameBoard.paintValidCells(this.element);
            this.gameOver(this.element);
        }
    }
};

Game.prototype.updateStatistics = function()
{
    let movesNum = document.getElementById("NumberOfMoves");
    movesNum.textContent ="Moves: " + this.numberOfMoves;

    let player1 = document.getElementById("p1score");
    player1.textContent = ' X ' + this.player1.score;

    let player2 = document.getElementById("p2score");
    player2.textContent =  ' X ' + this.player2.score;

    let has2discsB = document.getElementById("twoDiscsB");
    has2discsB.textContent ="Total of 2 discs: " + this.player1.have2discs;

    let has2discsW = document.getElementById("twoDiscsW");
    has2discsW.textContent ="Total of 2 discs: " + this.player2.have2discs;
};

// Helper function - The function checks if the selected cell is valid according to the given direction
Board.prototype.validMove = function(player,dr,dc,row,col)
{
    if (dr + row < 0 || dr + row > 9)
        return false;

    if (dc + col < 0 || dc + col > 9)
        return false;

    return this.playZone[dr + row][dc + col].element.getAttribute("status") !== "free";

};

/*Helper function - The function checks if the selected cell is valid according to the given direction*/
Board.prototype.isValidCell = function (x, y, currTurn) {
    //  console.log("THE x VALUE", x);
    //  console.log("THE y VALUE", y);
    //  console.log(this.playZone[x][y].element.getAttribute("status"));

    if(this.playZone[x][y].element.getAttribute("status") === "taken")
    {
        console.log("Invalid cell- taken cell");
        return false;
    }

    let row = Number(x);
    let col = Number(y);

    let nw = this.validMove(currTurn, -1, -1, row, col, this.element);
    let nn = this.validMove(currTurn, -1, 0, row,col, this.element);
    let ne = this.validMove(currTurn, -1, 1, row,col, this.element);
    let ww = this.validMove(currTurn, 0, -1, row, col, this.element);
    let ee = this.validMove(currTurn, 0, 1, row, col, this.element);
    let sw = this.validMove(currTurn, 1, -1, row, col, this.element);
    let sn = this.validMove(currTurn, 1, 0, row, col, this.element);
    let se = this.validMove(currTurn, 1, 1, row, col, this.element);

    return (nw||nn||ne||ww||ee||sw||sn||se);
};

//The flipDisc function checks if there are discs to flip in the current turn. Is so, flips the discs accordinglu.
Board.prototype.flipDisc = function(current_player_color, x, y,dx,dy)
{
    let currentX = Number(x);
    let currentY = Number(y);
    console.log("searching for disc to flip");
    let found = false;
    let exit = true;
    let other;
    let other_counter = 0;
    let total_flipped = 0;
    let i;
    let j;


    if(current_player_color === "black")
        other = "white";
    else
        other = "black";

    i = dy;
    j = dx;

    while((currentY+i >= 0) && (currentY+i <= 9)&& (currentX+j <= 9) &&  (currentX+j >= 0) && (exit) && (found === false))
    {
        if(this.playZone[currentX+j][currentY+i].element.getAttribute("status") ==="free")
        {
            console.log("free- exiting loop");
            exit = false;
        }

        if(this.playZone[currentX+j][currentY+i].element.getAttribute("status") ==="taken")
        {
            if(this.playZone[currentX+j][currentY+i].disc.color === other)
            {
                console.log("counter++");
                other_counter++;
            }
            else
            {
                found = true;
                console.log("exiting, found end of line");
            }
        }
        i+=dy;
        j+=dx;
    }
    console.log("found to flip:", other_counter);
    i= dy;
    j=dx;

    if(other_counter !== 0 && found)
    {
        total_flipped += other_counter;
        //flip the discs
        for(let k=0; k < other_counter; k++)
        {
            this.playZone[currentX+j][currentY+i].disc.color = current_player_color;
            this.playZone[currentX+j][currentY+i].disc.element.classList.remove(other);
            this.playZone[currentX+j][currentY+i].disc.element.classList.add(current_player_color);
            i+=dy;
            j+=dx;
        }
    }

    console.log("TOTAL FLIPPED: ", total_flipped);
    return total_flipped;
};


// Bonus - This function calculates and present the number of potential discs that the player would get
// if he will locate his disc in a specific cell.
Board.prototype.potentialDiscs = function(current_player_color, x, y,dx,dy)
{
    console.log("checking potential discs");
    let currentX = Number(x);
    let currentY = Number(y);
    console.log("searching for disc to flip");
    let found = false;
    let exit =true;
    let other;
    let other_counter = 0;
    let total_flipped = 0;

    if(current_player_color === "black")
        other = "white";
    else
        other = "black";
    //console.log("other",other);
    let i = dy;
    let j  = dx;

    while((currentY+i >= 0) && (currentY+i <= 9) && (currentX+j <= 9)&&  (currentX+j >= 0) && (exit) && (found === false))
    {
        if(this.playZone[currentX+j][currentY+i].element.getAttribute("status") === "free")
        {
            console.log("free- exiting loop");
            exit = false;
        }

        if(this.playZone[currentX+j][currentY+i].element.getAttribute("status") === "taken")
        {
            if(this.playZone[currentX+j][currentY+i].disc.color === other)
            {
                console.log("counter++");
                other_counter++;
            }
            else
            {
                found = true;
                console.log("exiting, found end of line");
            }
        }
        i += dy;
        j += dx;
    }
    console.log("found to flip:", other_counter);
    i = dy;
    j = dx;
    if(other_counter !== 0 && found)
    {
        total_flipped += other_counter;
    }

    console.log("TOTAL FLIPPED: ", total_flipped);
    return total_flipped;
};

//The function changeTurn changes the current turn after the player located his disc
Game.prototype.changeTurn = function () {
    let currentPlayer = document.getElementById("currentPlayer");

    if (this.turn === "white") {
        let endWhiteTurn = new Date();
        let startBlackTurn = endWhiteTurn;
        this.turn = "black";
        console.log("date chang turn to black", startBlackTurn);
        let total_seconds = (this.player2.startTime.getTime() - endWhiteTurn.getTime()) / 1000;
        this.turnDuration(total_seconds);
        this.player1.startTime = startBlackTurn;
        currentPlayer.classList.add("black");
        currentPlayer.classList.remove("white");
    } else {
        let endBlackTurn = new Date();
        let startWhiteTurn = endBlackTurn;
        this.turn = "white";
        console.log("date change turn to white", startWhiteTurn);
        let total_seconds = (this.player1.startTime.getTime() - endBlackTurn.getTime()) / 1000;
        this.turnDuration(total_seconds);
        this.player2.startTime = startWhiteTurn;

        currentPlayer.classList.remove("black");
        currentPlayer.classList.add("white");
    }
};

Game.prototype.turnDuration = function(seconds)
{
    console.log("avg player1 set by me to 0", this.player1.evgTime);
    console.log("avg player2 set by me to 0", this.player2.evgTime);

    seconds = Math.abs(seconds);
    console.log("In turn duration");
    console.log("Duration of current turn" ,seconds);
    if(this.turn === "white")
    {
        this.player1.evgTime = (this.player1.evgTime+seconds)/(this.player1.playernumberOfMoves);
        console.log("avg black " + this.player1.evgTime + " seconds " + seconds + " number of turn: " + this.player1.playernumberOfMoves );

        let avgTimeBlack = document.getElementById("avgTimeBlack");
        avgTimeBlack.textContent = "Average Time: " + Math.round(this.player1.evgTime) +" sec";
    }

    else
    {
        this.player2.evgTime = (this.player2.evgTime+seconds)/(this.player2.playernumberOfMoves);
        console.log("avg white " + this.player2.evgTime + " seconds " + seconds + " number of turn: " + this.player2.playernumberOfMoves );

        let avgTimeWhite = document.getElementById("avgTimeWhite");
        avgTimeWhite.textContent = "Average Time: " + Math.round(this.player2.evgTime)+" sec";

    }
};


//Checks if the game is over according to: 1.One of the players has 0 discs 2.The board is full 3.One of the playes stopped the game
Game.prototype.gameOver = function () {
    console.log("in gameOver");
    if(!this.endByClick)
    {
        if( this.player2.score === 0 || this.player1.score === 0 )
        {
            this.endByClick = true;
            if( this.player2.score === 0  )
            {
                this.winningWindow(this.element, this.player1.color);
            }
            else
                this.winningWindow(this.element, this.player2.color);
        }

        else if(this.player1.score + this.player2.score === 100)
        {
            this.endByClick = true;
            if(this.player1.score > this.player2.score)
            {
                this.winningWindow(this.element, this.player1.color);
            }

            else
                this.winningWindow(this.element, this.player2.color);
        }
    }
    else
    {
        if(this.player1.score > this.player2.score)
        {
            this.winningWindow(this.element, this.player1.color);
        }

        else if (this.player1.score < this.player2.score)
            this.winningWindow(this.element, this.player2.color);

        else
        {
            this.winningWindow(this.element, "tie");
        }
    }

};

//The function winningWindow prompt the winning section
Game.prototype.winningWindow = function (parentElement,winnerColor) {
    //clearInterval(interval);
    clearTimeout(t);
    for(let i=0; i<10; i++)
    {
        for (let j=0; j<10; j++)
        {
            if(this.gameBoard.playZone[i][j].element.getAttribute("status") === "free")
            {
                this.gameBoard.playZone[i][j].element.innerHTML = "";

            }
        }
    }

    let x = document.getElementsByClassName("display-board")[0];
    x.classList.add("endgameBody");
    for(let i=0; i<10; i++)
    {
        for (let j = 0; j < 10; j++)
        {
            this.gameBoard.playZone[i][j].element.classList.remove("validCell");
            this.gameBoard.playZone[i][j].element.classList.add("inValidcell");
        }
    }

    if(winnerColor !== "tie")
    {
        let myElement = document.getElementById("wining");
        let winHeader = document.getElementById("winner");
        winHeader.textContent = winnerColor.toUpperCase()+"  wins!";

        myElement.classList.add("modal-content");
        myElement.classList.remove("hidden");
    }

    else {
        console.log("its a tie");
        let myElement = document.getElementById("wining");
        let winHeader = document.getElementById("winner");

        winHeader.textContent = "Its a TIE";

        myElement.classList.add("modal-content");
        myElement.classList.remove("hidden");

    }
};



// ------ Functions ------ //
function restartGameByClick(){
    game.clearBoard();
}

//This function executed in case that one of the players clicked on the "Stop game" button
function endGameByClick() {
    console.log("stopped");
    if(!game.endByClick)
    {
        game.endByClick = true;
        game.gameOver(game);
    }
}


// --- Timer --- //
let clock = document.getElementById('clock'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    clock.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();

//Creating the game
let game = new Game();


