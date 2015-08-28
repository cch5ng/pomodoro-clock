//TODO add UI and interactivity
//display the remaining time status

//TODO, since the work and break clocks are both kind of the same, except for the duration and which is currently active
//maybe they should be defined as an object; this would reduce the use of global vars

//durations in milliseconds
// var sessionMin = 1,
//     breakMin = 1;
// var sessionLength = sessionMin * 60000;
// var breakLength = breakMin * 60000;
// var intervalId;
// var isSessionActive = true;

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

var Timer = function(minutes, isActive, classStr) {
  this.minutes = minutes || 0;
  this.milliseconds = this.minutes * 60000;
  this.isActive = isActive || false;
  this.classStr = classStr || '';
  this.timeRemaining = convertTime(this.milliseconds);
};

//increments timer's minutes property by one and updates minutes display
Timer.prototype.incMinutes = function() {
  this.minutes++;
  this.displayMinutes();
};

//decrements timer's minutes property by one and updates minutes display
Timer.prototype.decMinutes = function() {
  this.minutes--;
  this.displayMinutes();
}

Timer.prototype.countDown = function() {
  if (this.milliseconds - 1000 > 0) {
    this.milliseconds -= 1000;
    this.minutes -= 1;
    //console.log('sessionLength: ' + sessionLength);
    this.remainingTime = convertTime(this.milliseconds);
    this.displayMinutes();
    this.displayRemainingTime();
    this.isActive = true;
  } else {
    this.isActive = false;
    console.log('play alarm and change to other timer');
  }
}

Timer.prototype.start = function() {
  this.intervalId = setInterval(this.countDown, 1000);
}

Timer.prototype.stop = function() {
  clearInterval(this.intervalId);
  this.isActive = false;
}

Timer.prototype.reset = function() {
  this.stop();
  this.milliseconds = this.minutes * 60000;
}

Timer.prototype.displayMinutes = function() {
  var span = document.querySelector(this.classStr);
  console.log(span);
  span.innerHTML = '';
  span.innerHTML = this.minutes;
}

Timer.prototype.displayRemainingTime = function() {

}

var breakTimer = new Timer(5, false, '.break-min');
var sessionTimer = new Timer(25, true, '.session-min');
breakTimer.displayMinutes();
sessionTimer.displayMinutes();

console.log(breakTimer.minutes);
console.log(breakTimer.milliseconds);
console.log(breakTimer.isActive);
console.log(breakTimer.classStr);


console.log(sessionTimer.minutes);
console.log(sessionTimer.milliseconds);
console.log(sessionTimer.isActive);
console.log(sessionTimer.classStr);

//onclick listeners
var startBtn = document.getElementById('start');
startBtn.addEventListener('click', start);
var stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', stop);
var resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', reset);