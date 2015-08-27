//TODO add UI and interactivity
//display the remaining time status

//durations in milliseconds
var sessionLength = 1 * 60000;
var breakLength = 1 * 60000;
var intervalId;

//helper function to display human friendly time
//given time in milliseconds, returns an array
//such that [minutes, seconds]
function convertTime(millisecond) {
  var min, sec;
  var isCountingDown = false;
  
  min = Math.floor(millisecond / 60000);
  sec = (millisecond % 60000) / 1000;
  
  console.log('min: ' + min);
  console.log('sec: ' + sec);
  return [min, sec];
}

function countDown() {
  sessionLength -= 1000;
  console.log('sessionLength: ' + sessionLength);
  var timeRemaining = convertTime(sessionLength);
  isCountingDown = true;
}

//interval should be every second (1 millisecond / 1000)
function start() {
  intervalId = setInterval(countDown, 1000);
}

function stop() {
  clearInterval(intervalId);
  isCountingDown = false;
}

function reset() {
  stop();
  sessionLength = 25 * 60000;
  breakLenth = 5 * 60000;
}

//onclick listeners
var startBtn = document.getElementById('start');
startBtn.addEventListener('click', start);
var stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', stop);
var resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', reset);