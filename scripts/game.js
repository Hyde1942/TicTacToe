//(function (w, $, undefined){

//Global Game Variables
var HUMAN         = false;
var COMPUTER      = true;
var HUMANVAL     = -1;
var COMPUTERVAL   = 1;
var currentPlayer = HUMAN;
var gameState     = true;
var boardState    = [0,0,0,0,0,0,0,0,0];
var winMatrix     = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var scoreboard    = {human:0,computer:0,draw:0};


var gameEngine = {

    setControllers: function (){
        var $rows = $('.row');
        var $ai   = $('#computer');
        var $reset = $('#reset');
        var that  = this;

        $rows.on('click',function(){
            that.claim($(this));
        });

        $ai.on('click',function(){
            that.miniMax(boardState, 0, currentPlayer, true);
        });
        $reset.on('click',function(){
            that.reset(true);
        })
    },
    getPlayerValue: function (currentPlayer){
        return currentPlayer === HUMAN ? HUMANVAL : COMPUTERVAL;
    },
    claim: function (htmlElement){
      var index = htmlElement.index();
      if (gameState && boardState[index] === 0) {
        this.setBoard(index,currentPlayer);
      }
    },
    reset: function (game) {
        boardState = [0,0,0,0,0,0,0,0,0];
        gameState  = true;
        if (game){
            scoreboard = {human:0,computer:0,draw:0};
            $('input[type="text"]').val('');
        }
        $('.row').removeClass('human computer').html('');
    },
    setBoard: function (index, player){
        if (gameState && boardState[index] === 0) {
            var currentPlayerVal = this.getPlayerValue(player);
            boardState[index] = currentPlayerVal;
            currentPlayerVal === HUMANVAL ? $('.row').eq(index).addClass('human') : $('.row').eq(index).addClass('computer');
            currentPlayer = !currentPlayer;
            //Needs to check for win here!.
            if(this.checkWin(boardState, player) || this.checkFull(boardState)) {
                gameState = false;

                if (this.checkFull(boardState)) {
                    scoreboard.draw += 1;
                    currentPlayer = !currentPlayer;
                    $('#draw-games').val(scoreboard.draw);
                    this.reset(false);
                }else {
                    switch (currentPlayerVal) {
                        case -1:
                        alert('Player WON');
                        scoreboard.human += 1;
                        currentPlayer = !currentPlayer;
                        $('#player-score').val(scoreboard.human);
                        break;
                        
                        case 1:
                        scoreboard.computer += 1;
                        currentPlayer = !currentPlayer;
                        $('#computer-score').val(scoreboard.computer);
                        alert('Computer WON!');
                        break;
                    }
                    this.reset(false);
                }
                
            }

        }
    },
    checkFull: function (board) {
       for (var x = 0; x < 9; x++){
           if (board[x] === 0){
               return false;
           }
        }
       return true;
    },
    checkWin: function (board, player) {
      var currentPlayerVal = this.getPlayerValue(player);
      var win = true;
      for (var i = 0; i < 8; i++) {
        win = true;
            for (var j = 0; j < 3; j++) {
                if(board[winMatrix[i][j]] !== currentPlayerVal) {
                    win = false
                    break
                }
            }
            if (win) {
                return true
            }
        }
        return false  
    },
    miniMax : function (board, depth, player, turn) {
        if (this.checkWin(board, !player))
            return -10 + depth;
        if (this.checkFull(board))
            return 0;
        var value = this.getPlayerValue(player);
        var max = -Infinity;
        var index = 0;
        var tiles = $('.row');
        for (var x = 0; x < 9; x++) {
            if (depth == 0)
                tiles.eq(x).html('');
            if (board[x] == 0) {
                var newboard = board.slice();
                newboard[x] = value;
                var moveval = -this.miniMax(newboard, depth + 1, !player, false);
                if (depth == 0)
                    tiles.eq(x).html(moveval);
                if (moveval > max) {
                    max = moveval;
                    index = x;
                }
            }
        }
        if (turn)
            this.setBoard(index, player)
        return max;
    },
    init: function (){
        this.setControllers();
    }
};

gameEngine.init();



//})(window, jQuery)