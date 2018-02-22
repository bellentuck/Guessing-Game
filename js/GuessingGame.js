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


  $('#submit').removeClass('select-animation');
  void document.getElementById('submit').offsetWidth;
  $('#submit').addClass('select-animation');

  var guess = $('#player-input').val();
  $('#player-input').val('');
  var outcome = game.playersGuessSubmission(parseInt(guess, 10));

  document.getElementById('title').style.fontSize = "500%";
  processGuessOutcome(game, outcome);
}

function processGuessOutcome(game, outcome) {


  if (game.isOver) throw 'Cannot process guess if game is over';

  if (outcome === game.playerMessages.duplicate) {
    $('#title').text('Try a new number.');
    document.getElementById('title').style.fontSize = "350%";
  } else {
    $('#guesses').slideDown(500);
    $('#guessListTitle').show();
    $('#guesses-list li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess).show();
    document.getElementById('footer').style.height = '80px';
    // $('.header').addClass('col-6 col-sm-6').addClass('header-vertical');
  }

  if ((outcome === game.playerMessages.win) ||
     (outcome === game.playerMessages.lose)) {
    if (outcome === game.playerMessages.win) {
      $('#title').text('You win!');
    } else {
      $('#title').text('You lose.');
    }

    // here's what happens when a game ends
    // ( GAME OVER STUFF )
    // (( here for now ))

    $('#guesses').hide();
    document.getElementById('footer').style.height = '200px';
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
    $('#player-input').attr('placeholder', game.winningNumber);
    document.getElementById('player-input').style.opacity = .9;

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
  $('#guessListTitle').hide();
  $('#guesses').hide();


  $('#submit').click(function(event) {
    processPlayerGuess(game);
  });
  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && !game.isOver) {
      processPlayerGuess(game);
    }
  });

  // $('#guesses-list').on('li', 'hover', function() {
  //   var audio = document.getElementsByTagName("audio")[0];audio.play();
  // });

  var audio = $("#guessNostalgia")[0];
  $("#guesses-list li").mouseover(function() {
    audio.play();
  });



  // function hintTimer(hints) {
  //     document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  //     $('#title').text(hintText);
  // }

  $('#hint').click(function() {
    var hints = game.provideHint();
    var hintTexts = ['First Hint: ' + hints[0], 'Second Hint: ' + hints[1], ' Third Hint: ' +     hints[2], 'Final Hint: you have now glimpsed the winning number...', 'Guessing Game']
    var i = 1;
    function hintTimer() {
      $('#title').text(hintTexts[i]);
      i++;
      if (i === hintTexts.length) {
        document.getElementById('title').style.fontSize = "500%";
        $('#subtitle').text('Guess a number between 1 and 100...');
        $('#title').removeClass('fade-thru');
      }
    }
    $('#title').addClass('fade-thru');
    $('#title').text(hintTexts[0]);
    $('#subtitle').text('');
    var hintTimerInterval = setInterval(hintTimer, 4000);
    // var hintText = 'Hint: the winning number is either ' + hints[0] + ', ' +
    //   hints[1] + ', or ' + hints[2] + '.';
    document.getElementById('title').style.fontSize = "350%";
    // $('#title').text(hintText);
  });

  $('#reset').click(function() {
    game = newGame();
    $('#guesses-list li').hide();
    $('.answerWas').hide();
    $('#guessListTitle').hide();
    $('#guesses').hide();
    $('#title').text('Guessing Game');
    $('#subtitle').text('~owow it\'s a rematch~');
    $('.header').removeClass('col-6 col-sm-3');
    //document.getElementById('footer').style.height = '200px';

    var playerInput = document.getElementById('player-input');
    var submitBtn = document.getElementById('submit');
    playerInput.setAttribute("style", "z-index:1;");
    submitBtn.setAttribute("style", "z-index:2;");
    $('#player-input').attr('placeholder', '#');
    document.getElementById('player-input').style.opacity = 1;
    $('#submit').prop("disabled", false);
    $('#hint').prop("disabled", false);

    $('#gameboard').removeClass('opening-animation-titles');
    $('#input-container').removeClass('opening-animation-btns');
    $('#footer').removeClass('opening-animation-footer');
    void document.getElementById('gameboard').offsetWidth;
    $('#gameboard').addClass('opening-animation-titles');
    $('#input-container').addClass('opening-animation-btns');
    $('#footer').addClass('opening-animation-footer');

  });

  $('#title').on("DOMSubtreeModified",function(){
    //console.log('changed');
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
