//TODO add UI and interactivity
//display the remaining time status

//TODO, since the work and break clocks are both kind of the same, except for the duration and which is currently active
//maybe they should be defined as an object; this would reduce the use of global vars

//durations in milliseconds
// var sessionMin = 1,
//     breakMin = 1;
// var sessionLength = sessionMin * 60000;
// var breakLength = breakMin * 60000;
var sessionIntervalId, breakIntervalId;
// var isSessionActive = true;

//helper function to display human friendly time
//given time in milliseconds, returns an array
//such that [minutes, seconds]
function convertTime(millisecond) {
  var min, sec;
  var isCountingDown = false;
  
  min = Math.floor(millisecond / 60000);
  sec = (millisecond % 60000) / 1000;
  
  //console.log('min: ' + min);
  //console.log('sec: ' + sec);
  return [min, sec];
}

var Timer = function(name, minutes, isActive, classStr) {
  this.nameStr = name;
  this.minutesSet = minutes || 0;
  this.milliseconds = this.minutesSet * 60000;
  //console.log('this.milliseconds: ' + this.milliseconds)
  //isActive indicates if this is the current timer displayed in the clock section
  this.isActive = isActive || false;
  //isCountingDown indicates if the countdown timer is active for this timer
  this.isCountingDown = false;
  this.classStr = classStr || '';
  this.remainingTime = convertTime(this.milliseconds);
  this.intervalId = null;
};

Timer.prototype.getMilliseconds = function() {
  return this.milliseconds;
}

//increments timer's minutes property by one and updates minutes display
Timer.prototype.incMinutes = function() {
  this.minutesSet++;
  console.log('this.minutesSet: ' + this.minutesSet);
  this.displayMinutes();
};

//decrements timer's minutes property by one and updates minutes display
Timer.prototype.decMinutes = function() {
  this.minutesSet--;
  console.log('this.minutesSet: ' + this.minutesSet);
  this.displayMinutes();
}

Timer.prototype.countDown = function() {
  console.log('commented everything out');

  // console.log('this: ' + this);
  // console.log(this.milliseconds);
  // console.log(typeof this.milliseconds);
  // if (this.milliseconds - 1000 > 0) {
  //   this.isActive = true;
  //   this.isCountingDown = true;
  //   this.milliseconds -= 1000;
  //   this.remainingTime = convertTime(this.milliseconds);
  //   this.displayRemainingTime();
  // } else {
  //   this.stop();
  //   this.isCountingDown = false;
  //   this.isActive = false;
  //   console.log('play alarm and change to other timer');
  //   //toggleTimer();
  // }
}

Timer.prototype.start = function() {
  console.log('this: ' + this);
//adding this reference to original this so that countDown doesn't get called with window as this
  var that = this;
  console.log(that.nameStr);

  if (that.nameStr === 'Session') {
    sessionIntervalId = window.setInterval(that.countDown, 1000);
    //sessionIntervalId = window.setInterval(this.countDown.call(that), 1000);
  } else {
    breakIntervalId = window.setInterval(that.countDown, 1000);
    //breakIntervalId = window.setInterval(this.countDown.call(that), 1000);
  }
  //this.intervalId = window.setInterval(this.countDown.call(that), 1000);
  //console.log('this.intervalId: ' + this.intervalId);
  //this.intervalId = setInterval(this.countDown, 1000);
  //var intervalId = setInterval(this.countDown, 1000);
  //var intervalId = setInterval(this.countDown.call(that), 1000);
}

Timer.prototype.stop = function() {
  console.log('this: ' + this);
  console.log(this.nameStr);
  //console.log('this.intervalId: ' + this.intervalId);
  if (this.nameStr === 'Session') {
    clearInterval(sessionIntervalId);
  } else {
    clearInterval(breakIntervalId);
  }
  //clearInterval(this.intervalId);
  //this.isActive = false;
  this.isCountingDown = false;
}

//not currently used
Timer.prototype.reset = function() {
  this.stop();
  this.milliseconds = this.minutes * 60000;
}

Timer.prototype.displayMinutes = function() {
  var span = document.querySelector(this.classStr);
  //console.log(span);
  span.innerHTML = '';
  span.innerHTML = this.minutesSet;
}

Timer.prototype.displayTimerName = function() {
  var div = document.querySelector('.timer-name');
  div.innerHTML = '';
  div.innerHTML = this.nameStr;
}

Timer.prototype.displayRemainingTime = function() {
  var min = this.remainingTime[0], 
      sec = this.remainingTime[1];
//reformatting seconds, prepend with '0'
  if (sec < 10) {
    sec = '0' + sec;
  }
  var div = document.querySelector('.remaining-time');
  div.innerHTML = '';
  div.innerHTML = min + ':' + sec;
}

//breakTimer: default minutes should be 5
var breakTimer = new Timer('Break', 1, false, '.break-min');
//sessionTimer: default minutes should be 25
var sessionTimer = new Timer('Session', 1, true, '.session-min');

breakTimer.countDown = function() {
  if (breakTimer.milliseconds - 1000 >= 0) {
    breakTimer.isActive = true;
    breakTimer.isCountingDown = true;
    breakTimer.displayTimerName();
    breakTimer.milliseconds -= 1000;
    breakTimer.remainingTime = convertTime(breakTimer.milliseconds);
    breakTimer.displayRemainingTime();
  } else if (sessionTimer.milliseconds - 1000 >= 0) {
    breakTimer.stop();
    breakTimer.isCountingDown = false;
    breakTimer.isActive = false;
    console.log('play alarm and change to other timer');
//TODO need to test case where break goes session
    sessionTimer.start();
//might break next two lines out into a reset function
    breakTimer.milliseconds = breakTimer.minutesSet * 60000;
    breakTimer.remainingTime = convertTime(breakTimer.milliseconds);
    //toggleTimer();
  }
}

sessionTimer.countDown = function() {
  console.log('does this get here');
  console.log('this.milliseconds: ' + this.milliseconds);

  if (sessionTimer.milliseconds - 1000 >= 0) {
    sessionTimer.isActive = true;
    sessionTimer.isCountingDown = true;
    sessionTimer.displayTimerName();
    sessionTimer.milliseconds -= 1000;
    console.log('milliseconds: ' + sessionTimer.milliseconds);
    sessionTimer.remainingTime = convertTime(sessionTimer.milliseconds);
    sessionTimer.displayRemainingTime();
  } else if (breakTimer.milliseconds - 1000 >= 0) {
    sessionTimer.stop();
    sessionTimer.isCountingDown = false;
    sessionTimer.isActive = false;
    console.log('play alarm and change to other timer');
//TODO need to test case where session goes to break 
    breakTimer.start();
//might break next two lines out into a reset function
    sessionTimer.milliseconds = sessionTimer.minutesSet * 60000;
    sessionTimer.remainingTime = convertTime(sessionTimer.milliseconds);
    //toggleTimer();
  }
}


//initial display
breakTimer.displayMinutes();
sessionTimer.displayMinutes();

if (sessionTimer.isActive) {
  sessionTimer.displayTimerName();
  sessionTimer.displayRemainingTime();
} else {
  breakTimer.displayTimerName();
  breakTimer.displayRemainingTime();
}

//click handlers
var toggleTimer = function() {
  if (sessionTimer.isActive && sessionTimer.isCountingDown) {
    console.log('sessionTimer.stop');
    sessionTimer.stop();
  } else if (sessionTimer.isActive && !sessionTimer.isCountingDown) {
    console.log('sessionTimer.start');
    sessionTimer.start();
  } else if (breakTimer.isActive && breakTimer.isCountingDown) {
    breakTimer.stop();
  } else if (breakTimer.isActive && !breakTimer.isCountingDown) {
    breakTimer.start();
  }
};


//onclick listeners
var divClock = document.querySelector('.clock');
divClock.addEventListener('click', toggleTimer);

var iconBreakMinus = document.querySelector('.break-minus');
iconBreakMinus.addEventListener('click', breakTimer.decMinutes.apply(breakTimer));
var iconBreakPlus = document.querySelector('.break-plus');
iconBreakPlus.addEventListener('click', breakTimer.incMinutes.apply(breakTimer));
var iconSessionMinus = document.querySelector('.session-minus');
iconSessionMinus.addEventListener('click', sessionTimer.decMinutes.apply(sessionTimer));
var iconSessionPlus = document.querySelector('.session-plus');
iconSessionPlus.addEventListener('click', sessionTimer.incMinutes.apply(sessionTimer));

// var startBtn = document.getElementById('start');
// startBtn.addEventListener('click', start);
// var stopBtn = document.getElementById('stop');
// stopBtn.addEventListener('click', stop);

//TODO, don't have a ui element for this event
// var resetBtn = document.getElementById('reset');
// resetBtn.addEventListener('click', reset);