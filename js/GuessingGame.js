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

  if (outcome === game.playerMessages.duplicate) {
    $('#title').text('Try a new number.');
  } else {
    $('#guesses-list li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess).show();
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

  } else {
    var higherOrLower = game.isLower() ? 'higher' : 'lower';
    $('#title').text(outcome);
    $('#subtitle').text(' Guess ' + higherOrLower + '!');
  }
}

$(document).ready(function() {
  var game = newGame();
  $('#guesses-list li').hide();

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

  });
});
