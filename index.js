






// $(document).ready(function() {

//   //makeCanvasFullPage();
//   //loadInGradients("https://github.com/ghosh/uiGradients/blob/master/gradients.json");
//   // setEventListeners();
// });


//   /* Guess Button animation */
// // function setEventListeners() {
// //   var goBtn = document.getElementById("submit");
// //   goBtn.addEventListener('click', function() {
// //     goBtn.preventDefault;
// //     // See: https://css-tricks.com/restart-css-animation/
// //     goBtn.classList.remove("select-animation");
// //     void goBtn.offsetWidth;
// //     goBtn.classList.add("select-animation");
// //   }, false);
//   /*
//   var input = document.getElementById("input-parent");
//   input.addEventListener('mouseenter', function() {
//     input.preventDefault;
//     // See: https://css-tricks.com/restart-css-animation/
//     console.log('here!');
//     // $('#player-input').classList.remove("player-input-animation");
//     // void $('#player-input').offsetWidth;
//     // $('#player-input').classList.add("player-input-animation");
//     // $('#submit').classList.remove("submit-input-animation");
//     // void $('#submit').offsetWidth;
//     // $('#submit').classList.add("submit-input-animation");
//   }, false);
//   */
// // }



// /* Gradient stuff */

// function makeCanvasFullPage() {
//   var canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// }

// function loadInGradients(url) {
//   $.getJSON(url, function(json) {
//     var results = getResultColors(json);
//     setBackgroundGradient(results);
//   });
// }

// function getResultColors(data) {
//   var result = [];
//   for (var i = 0; i < data.length; i++) {
//     result = addColorsEntryToResults(result, data[i]['colors']);
//   }
//   return result;
// }

// function setBackgroundGradient(data) {
//   var gradientInfo = data[getRandomInt(data.length)];
//   var ctx = document.getElementById('canvas').getContext('2d');
//   var gradient = ctx.createLinearGradient(0, 0, window.innerHeight, window.innerWidth);
//   gradient.addColorStop(0, gradientInfo[0]);
//   gradient.addColorStop(1, gradientInfo[1]);
//   ctx.fillStyle = gradient;
//   ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
// }

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }
