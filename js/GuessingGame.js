/*
1. Game Engine
  a) Game object and prototype functions
  b) Game helper functions
2. View Logic
  a) new game and reset
  b) guess processing
  c) game over
  d) hints
3. jQuery script
*/

/* ----------------------------- 1. Game Engine ----------------------------- */
/* --------------- a) Game object and prototype functions ------------------- */
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

Game.prototype.playerMessages = {
  win: "You Win!",
  lose: "You Lose.",
  close: "You're burning up!",
  medium: "You're lukewarm.",
  far: "You're a bit chilly.",
  veryFar: "You're ice cold!",
  duplicate: "You have already guessed that number."
}

Game.prototype.playersGuessSubmission = function(n) {
  if (invalidGuess(n)) throw 'That is an invalid guess.';
  this.playersGuess = n;
  return this.checkGuess(); // have to actually *return* the result!
}

Game.prototype.checkGuess = function() {
  if (this.pastGuesses.includes(this.playersGuess)) return this.playerMessages.duplicate;
  this.pastGuesses.push(this.playersGuess);
  if (this.playersGuess === this.winningNumber) return this.playerMessages.win;
  if (this.pastGuesses.length === 5) return this.playerMessages.lose;
  return this.getIntermediatePlayerMessage();
}

Game.prototype.getIntermediatePlayerMessage = function() {
  let distFromWin = this.difference();
  if (distFromWin < 50) {
    if (distFromWin < 25) {
      if (distFromWin < 10) return this.playerMessages.close;
      return this.playerMessages.medium;
    } return this.playerMessages.far;
  } return this.playerMessages.veryFar;
}

Game.prototype.provideHint = function() {
  return shuffle(
    [this.winningNumber, generateWinningNumber(), generateWinningNumber()]
  );
}

/* ---------------------- b) Game helper functions -------------------------- */
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


/* ----------------------------- 2. View Logic ------------------------------ */
/* ------------------------ a) New game and reset --------------------------- */
function hideGuessesList() {
  $('#guesses-list li').hide();
  $('#guessListTitle').hide();
  $('#guesses').hide().css('bottom', '68px');
}

function hideAnswerLabel() {
  $('.answerWas').hide();
}

function resetTopLevelForRematch() {
  resetHeaderForRematch();
  $('.top-level').css("margin-top", "87px");
  resetControlsForRematch();
}

function resetHeaderForRematch() {
  $('#title').text('Guessing Game');
  $('#subtitle').text('~owow it\'s a rematch~');
  $('.header').removeClass('col-6 col-sm-3');
}

function resetControlsForRematch() {
  var playerInput = document.getElementById('player-input');
  var submitBtn = document.getElementById('submit');
  playerInput.setAttribute("style", "z-index:1;");
  submitBtn.setAttribute("style", "z-index:2;");
  $('#player-input').attr('placeholder', '#');
  document.getElementById('player-input').style.opacity = 1;
}

function enableSubmitAndHintButtons() {
  $('#submit').prop("disabled", false);
  $('#hint').prop("disabled", false);
}

function runOpeningAnimations() {
  $('#gameboard').removeClass('opening-animation-titles');
  $('#input-container').removeClass('opening-animation-btns');
  $('#footer').removeClass('opening-animation-footer');
  void document.getElementById('gameboard').offsetWidth;
  $('#gameboard').addClass('opening-animation-titles');
  $('#input-container').addClass('opening-animation-btns');
  $('#footer').addClass('opening-animation-footer');
}

/* ------------------------ b) Guess Processing ----------------------------- */
function processPlayerGuess(game) {
  animateGoButton();
  let outcome = getOutcomeFromGuess(game);
  document.getElementById('title').style.fontSize = "500%";
  processGuessOutcome(game, outcome);
}

function animateGoButton() {
  $('#submit').removeClass('select-animation');
  void document.getElementById('submit').offsetWidth;
  $('#submit').addClass('select-animation');
}

function getOutcomeFromGuess(game) {
  let guess = $('#player-input').val();
  $('#player-input').val('');
  return game.playersGuessSubmission(parseInt(guess, 10));
}

function showGuesses(game) {
  $('.top-level').css("margin-top", "0px");
  $('#guesses').slideDown(500);
  $('#guessListTitle').show();
  $('#guesses-list li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess).show(100);
}

function processGuessOutcome(game, outcome) {
  setTimeout(function(){
    if (game.isOver) throw 'Cannot process guess if game is over';

    if (outcome === game.playerMessages.duplicate) {
      // $('#title').text('Try a new number.');
      document.getElementById('title').style.fontSize = "350%";

    } else {
      showGuesses(game);
    }

  if ((outcome === game.playerMessages.win) ||
     (outcome === game.playerMessages.lose)) {
    if (outcome === game.playerMessages.win) {
      $('#title').text('You win!');
    } else {
      $('#title').text('You lose.');
    }
    processEndgame(game);

  } else {
    var higherOrLower = game.isLower() ? 'higher' : 'lower';
    $('#title').text(outcome);
    $('#subtitle').text(' Guess ' + higherOrLower + '!');
  }

  }, 200);
}

/* --------------------------- c) Game Over --------------------------------- */
function processEndgame(game) {
  removeGuessList(game);
  getTopLevelEndgameState();
  $('#player-input').attr('placeholder', game.winningNumber);
  game.isOver = true;
}

function removeGuessList(game) {
  $('#guessListTitle').hide();
  animateGuessListDown();
  animateGuessesAway(game);
}

function animateGuessListDown() {
  $('#guesses').animate({
    bottom: '-68px'
  }, {
    duration: 350
  });
}

function animateGuessesAway(game) {
  $('#guesses-list li:nth-child(1)').text(game.playersGuess).hide(200);
  $('#guesses-list li:nth-child(2)').text(game.playersGuess).hide(400);
  $('#guesses-list li:nth-child(3)').text(game.playersGuess).hide(600);
  $('#guesses-list li:nth-child(4)').text(game.playersGuess).hide(800);
  $('#guesses-list li:nth-child(5)').text(game.playersGuess).hide(1000);
}

function getTopLevelEndgameState() {
  $('.top-level').css("margin-top", "87px");
  displayResetMessage();
  disableSubmitAndHintButtons();
  $('.header').removeClass('col-6 col-sm-3');
  displayAnswerOverGlossedInputAndSubmitOrbs();
}

function displayResetMessage() {
  $('#subtitle').text('~reset to rematch~');
}

function disableSubmitAndHintButtons() {
  $('#submit').prop("disabled", true);
  $('#hint').prop("disabled", true);
}

function displayAnswerOverGlossedInputAndSubmitOrbs() {
  $('.answerWas').show();
  let playerInput = document.getElementById('player-input');
  let submitBtn = document.getElementById('submit');
  playerInput.setAttribute("style", "z-index:-2;");
  submitBtn.setAttribute("style", "z-index:-1;");
  document.getElementById('player-input').style.opacity = .9;
}

/* ------------------------------ d) Hints ---------------------------------- */
function runHintTimer(hintTexts) {
  let i = 1;
  function hintTimer() {
    $('#title').text(hintTexts[i]);
    i++;
    if (i === hintTexts.length) {
      endHintTimer();
    }
  }
  giveHint(hintTexts[0]);
  let hintTimerInterval = setInterval(hintTimer, 4000);
  document.getElementById('title').style.fontSize = "350%";
}

function endHintTimer() {
  document.getElementById('title').style.fontSize = "500%";
  $('#subtitle').text('Guess a number between 1 and 100...');
  $('#title').removeClass('fade-thru');
}

function giveHint(hint) {
  $('#title').addClass('fade-thru');
  $('#title').text(hint);
  $('#subtitle').text('');
}


/* ------------------------- 3. jQuery Script ------------------------------- */
$(document).ready(function() {

  var game = newGame();
  hideGuessesList();
  hideAnswerLabel();

  $('#submit').click(function(event) {
    processPlayerGuess(game);
  });
  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && !game.isOver) {
      processPlayerGuess(game);
    }
  });

  $('#hint').click(function() {
    let hints = game.provideHint();
    let hintTexts = ['First Hint: ' + hints[0], 'Second Hint: ' + hints[1], ' Third Hint: ' +     hints[2], 'Final Hint: you have now glimpsed the winning number...', 'Guessing Game']
    runHintTimer(hintTexts);
  });

  $('#reset').click(function() {
    game = newGame();
    hideGuessesList();
    hideAnswerLabel();
    resetTopLevelForRematch();
    enableSubmitAndHintButtons();
    runOpeningAnimations();
  });

  //// For debugging purposes
  // $('#title').on("DOMSubtreeModified",function(){
  //   console.log('changed');
  // });

  var audio = $("#guessNostalgia")[0];
  $("#guesses-list li").mouseover(function() {
    audio.play();
  });

});
