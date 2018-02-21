// Game engine -------------------//

function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element. (3-part swap)
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function invalidGuess(n) {
  return parseInt(n) !== n || n < 1 || n > 100;
}

function newGame() {
  return new Game();
}


function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  this.isOver = false;
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(n) {
  if (invalidGuess(n)) throw 'That is an invalid guess.';
  this.playersGuess = n;
  return this.checkGuess(); // have to actually *return* the result!
}

Game.prototype.playerMessages = {
  win: "You Win!",
  lose: "You Lose.",
  close: "You're burning up!",
  medium: "You're lukewarm.",
  far: "You're a bit chilly.",
  veryFar: "You're ice cold!",
  duplicate: "You have already guessed that number."
}

Game.prototype.checkGuess = function() {

  if (this.pastGuesses.includes(this.playersGuess)) return this.playerMessages.duplicate;

  this.pastGuesses.push(this.playersGuess);

  if (this.playersGuess === this.winningNumber) return this.playerMessages.win;
  if (this.pastGuesses.length === 5) return this.playerMessages.lose;

  var distFromWin = this.difference();
  if (distFromWin < 50) {
    if (distFromWin < 25) {
      if (distFromWin < 10) return this.playerMessages.close;
      return this.playerMessages.medium;
    }
    return this.playerMessages.far;
  }
  return this.playerMessages.veryFar;

}

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}


// jQuery stuff ---------------------------//
function processPlayerGuess(game) {
  var guess = $('#player-input').val();
  $('#player-input').val('');
  var outcome = game.playersGuessSubmission(parseInt(guess, 10));
  processGuessOutcome(game, outcome);
}

function processGuessOutcome(game, outcome) {


  if (game.isOver) throw 'Cannot process guess if game is over';

  if (outcome === game.playerMessages.duplicate) {
    $('#title').text('Try a new number.');
  } else {
    $('#guesses-list li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess).show();
    $('.header').addClass('col-6 col-sm-3').addClass('header-vertical');
  }

  if ((outcome === game.playerMessages.win) ||
     (outcome === game.playerMessages.lose)) {
    if (outcome === game.playerMessages.win) {
      $('#title').text('You win!');
    } else {
      $('#title').text('You lose.');
    }
    $('#subtitle').text('~reset to rematch~');
    $('#submit').prop("disabled", true);
    $('#hint').prop("disabled", true);
    $('.header').removeClass('col-6 col-sm-3');
    game.isOver = true;
    $('.answerWas').show();
    // convert z-indexes to negative - which is actually perfect
    // that way then you cant put in any guesses any more.
    var playerInput = document.getElementById('player-input');
    var submitBtn = document.getElementById('submit');
    playerInput.setAttribute("style", "z-index:-2;");
    submitBtn.setAttribute("style", "z-index:-1;");


  } else {
    var higherOrLower = game.isLower() ? 'higher' : 'lower';
    $('#title').text(outcome);
    $('#subtitle').text(' Guess ' + higherOrLower + '!');
  }
}

$(document).ready(function() {
  var game = newGame();
  $('#guesses-list li').hide();
  $('.answerWas').hide();

  $('#submit').click(function(event) {
    processPlayerGuess(game);
  });
  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      processPlayerGuess(game);
    }
  });

  $('#reset').click(function() {
    game = newGame();
    $('#guesses-list li').hide();
    $('.answerWas').hide();
    $('#title').text('Guessing Game');
    $('#subtitle').text('~owow it\'s a rematch~');
    $('.header').removeClass('col-6 col-sm-3');

    var playerInput = document.getElementById('player-input');
    var submitBtn = document.getElementById('submit');
    playerInput.setAttribute("style", "z-index:1;");
    submitBtn.setAttribute("style", "z-index:2;");

  });

  $('#title').on("DOMSubtreeModified",function(){
    console.log('changed');
  });


});


// Have a game-like obj but for gameboard

// function newGame() {
//   return new Game();
// }


// function Game() {
//   this.playersGuess = null;
//   this.pastGuesses = [];
//   this.winningNumber = generateWinningNumber();
// }

// Game.prototype.difference = function() {
//   return Math.abs(this.playersGuess - this.winningNumber);
// }
