const GameBoard = function (){
    let _boardArr = ["", "", "", "", "", "", "", "", ""]
    
    function updateBoard(mark, cellIndex){
        _boardArr[cellIndex] = mark
    }
    
    function getBoard(){
        return _boardArr
    }

    function restartBoard(){
        _boardArr = ["", "", "", "", "", "", "", "", ""]
    }

    return {
        updateBoard,
        getBoard,
        restartBoard
    }
}()

const GameControl = function () {
    let player1 = Player("X", "Player1") //main idea is that player1 is human if there is AI
    let player2 = Player("O", "Player2")
    // let gameEnd = false
    let gameResult = null
    let turn = 1
    let winningPositions = [
                            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
                            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                            [0, 4, 8], [2, 4, 6]
                            ]

    function startGame(){
        const gameCells = document.querySelectorAll(".gameCell")
        gameCells.forEach(cell => {
            cell.addEventListener("click", getClickedCell)
        })

        DisplayControl.displayActivePlayer(player1)
    }

    function resetGame() {
        GameBoard.restartBoard()
        DisplayControl.clearMarks()
        player1.clearMoves()
        player2.clearMoves()
        startGame()
    }
    
    function getClickedCell(e){
        // console.log(e.target)
        e.target.removeEventListener("click" ,getClickedCell)
        const cellIndex = parseInt(e.target.getAttribute("data-cell-index"))
        playerMove(cellIndex)
    }
    
    function playerMove(cellIndex){
        DisplayControl.toggleActivePlayer()
        if(turn == 1){
            //player1 turn
            // console.log(player1.getName(), player1.getPlayerMark())
            player1.makeMove(cellIndex)
            setTimeout(function(){checkResult(player1)}, 200) //a bit dirty way to wait for Mark to be painted before checking the result
            turn--
        }else{
            //player2 turn
            // console.log(player2.getName(), player2.getPlayerMark())
            player2.makeMove(cellIndex)
            setTimeout(function(){checkResult(player2)}, 200)
            turn++
        }
    }

    function checkResult(player){
        const currentBoard = GameBoard.getBoard()
        const playerMoves = player.getPlayerMoves()
        // console.log(playerMoves)

        //STATING FROM HERE IS NEW LOGIT
        const checkIfWinningMove = (movesCombo) => movesCombo.every(move => playerMoves.includes(move))
        const checkWinner = winningPositions.some(checkIfWinningMove) //returns true if winnder, false if else
        // console.log(checkWinner)

        if (checkWinner) {
            // gameEnd = true
            gameResult = player.getPlayerMark()
            endGame(gameResult)
        }else{
            if (!currentBoard.includes("")) {
                gameResult = "tie"
                endGame(gameResult)
            }
        }
    }

    function endGame(result){
        const gameCells = document.querySelectorAll(".gameCell")
        gameCells.forEach(cell => {
            cell.removeEventListener("click", getClickedCell)
        })

        DisplayControl.endGameAlert(result)
        resetGame()
    }

    function changePlayersMarks(newMark){
        switch(newMark){
            case "O":
                turn = 0 //done so X always start
                player1.setPlayerMark(newMark)
                player2.setPlayerMark("X")
                break
            case "X":
                turn = 1 //always start X
                player1.setPlayerMark(newMark)
                player2.setPlayerMark("O")
                break
        }
    }

    return{
        startGame,
        resetGame,
        changePlayersMarks
    }
}()

function Player(mark, name){
    //let playersMoves vamos a comporibar si gana o pierde
    let _playerMark = mark
    let _playerMoves = []
    let _name = name

    function makeMove(cellIndex){
        _playerMoves.push(cellIndex)
        GameBoard.updateBoard(_playerMark, cellIndex)
        DisplayControl.paintMark(_playerMark, cellIndex)
    }

    function getPlayerMoves(){
        return _playerMoves
    }

    function getPlayerMark(){
        return _playerMark
    }

    function setPlayerMark(newMark){
        _playerMark = newMark
        // console.log(_name, " HAS : ", _playerMark)
    }

    function clearMoves(){
        _playerMoves = []
    }

    function getName(){
        return _name
    }

    return {
        makeMove,
        getPlayerMoves,
        getPlayerMark,
        setPlayerMark,
        getName,
        clearMoves
    }
}


let DisplayControl = function(doc){
    const gameCells = doc.querySelectorAll(".gameCell")
    const markPicker = doc.querySelector("#mark")
    const player1Tag = doc.querySelector("#player1")
    const player2Tag = doc.querySelector("#player2")
    markPicker.addEventListener("change", newPlayerMark)

    function newPlayerMark(){
        const newMark = doc.querySelector("#mark").value
        GameControl.changePlayersMarks(newMark)
        GameControl.resetGame()
    }

    function clearMarks(){
        gameCells.forEach(cell => cell.textContent = "")
    }

    function paintMark(mark, cellIndex){
        gameCells[cellIndex].textContent = mark
    }

    function endGameAlert(result){
        if(result === "tie"){
            alert(`Game ended. It's a tie`)
        }else{ 
            alert(`Game ended. ${result} Won!`)
        } 
    }

    function displayActivePlayer(p1){
        if (p1.getPlayerMark() === "X") {
            doc.querySelector("#player1").classList.add("active")
            doc.querySelector("#player2").classList.remove("active")
        } else {
            doc.querySelector("#player2").classList.add("active")
            doc.querySelector("#player1").classList.remove("active")
        }
    }

    function toggleActivePlayer(){
        player1Tag.classList.toggle("active")
        player2Tag.classList.toggle("active")
    }

    return {
        paintMark,
        endGameAlert,
        clearMarks,
        displayActivePlayer,
        toggleActivePlayer
    }

}(document)

GameControl.startGame()