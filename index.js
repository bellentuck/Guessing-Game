/* Gradient stuff */

$(document).ready(function() {
  makeCanvasFullPage();
  loadInGradients("https://github.com/ghosh/uiGradients/blob/master/gradients.json");
});

function makeCanvasFullPage() {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function loadInGradients(url) {
  $.getJSON(url, function(json) {
    var results = getResultColors(json);
    setBackgroundGradient(results);
  });
}

function getResultColors(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result = addColorsEntryToResults(result, data[i]['colors']);
  }
  return result;
}

function setBackgroundGradient(data) {
  var gradientInfo = data[getRandomInt(data.length)];
  var ctx = document.getElementById('canvas').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, window.innerHeight, window.innerWidth);
  gradient.addColorStop(0, gradientInfo[0]);
  gradient.addColorStop(1, gradientInfo[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
