var sessionIntervalId, breakIntervalId;

//helper function to display human friendly time
//given time in milliseconds, returns an array
//such that [minutes, seconds]
function convertTime(millisecond) {
  var min, sec;
  var isCountingDown = false;

  min = Math.floor(millisecond / 60000);
  sec = (millisecond % 60000) / 1000;

  return [min, sec];
}

var Timer = function(name, minutes, isActive, classStr) {
  this.nameStr = name;
  this.minutesSet = minutes || 0;
  this.milliseconds = this.minutesSet * 60000;

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
// Timer.prototype.incMinutes = function() {
//   console.log('not currently in use');
// };

//decrements timer's minutes property by one and updates minutes display
// Timer.prototype.decMinutes = function() {
//   console.log('not currently in use');
// }

// Timer.prototype.countDown = function() {
//   console.log('commented everything out');
// }

Timer.prototype.start = function() {
  console.log('this: ' + this);
//adding this reference to original this so that countDown doesn't get called with window as this
  var that = this;
  console.log(that.nameStr);

  if (that.nameStr === 'Session') {
    sessionIntervalId = window.setInterval(that.countDown, 1000);
  } else {
    breakIntervalId = window.setInterval(that.countDown, 1000);
  }
}

Timer.prototype.stop = function() {
  console.log('this: ' + this);
  console.log(this.nameStr);
  if (this.nameStr === 'Session') {
    clearInterval(sessionIntervalId);
  } else {
    clearInterval(breakIntervalId);
  }
  this.isCountingDown = false;
}

//not currently used
Timer.prototype.reset = function() {
  this.stop();
  this.milliseconds = this.minutes * 60000;
}

Timer.prototype.displayMinutes = function() {
  var span = document.querySelector(this.classStr);
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

//defining countDown() separately for breakTimer because otherwise was getting issues with this and setInterval
breakTimer.countDown = function() {
  if (breakTimer.milliseconds - 1000 >= 0) {
    breakTimer.isActive = true;
    breakTimer.isCountingDown = true;
    breakTimer.displayTimerName();
    breakTimer.milliseconds -= 1000;
    breakTimer.remainingTime = convertTime(breakTimer.milliseconds);
    breakTimer.displayRemainingTime();
  } else if (sessionTimer.milliseconds - 1000 >= 0) {
    $('.clock').toggleClass('session');
    $('.clock').toggleClass('break');
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

//defining countDown() separately for sessionTimer because otherwise was getting issues with this and setInterval
sessionTimer.countDown = function() {
  if (sessionTimer.milliseconds - 1000 >= 0) {
    sessionTimer.isActive = true;
    sessionTimer.isCountingDown = true;
    sessionTimer.displayTimerName();
    sessionTimer.milliseconds -= 1000;
    console.log('milliseconds: ' + sessionTimer.milliseconds);
    sessionTimer.remainingTime = convertTime(sessionTimer.milliseconds);
    sessionTimer.displayRemainingTime();
  } else if (breakTimer.milliseconds - 1000 >= 0) {
    $('.clock').toggleClass('session');
    $('.clock').toggleClass('break');
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

//breaking out functions from the prototype
//increments timer's minutes property by one and updates minutes display
breakTimer.incMinutes = function() {
  breakTimer.minutesSet++;
  console.log('breakTimer.minutesSet: ' + breakTimer.minutesSet);
  breakTimer.displayMinutes();

  //updates remaining time display
  if (breakTimer.isActive && !breakTimer.isCountingDown) {
    breakTimer.milliseconds = breakTimer.minutesSet * 60000;
    breakTimer.remainingTime = convertTime(breakTimer.milliseconds);
    breakTimer.displayRemainingTime();
  }
};

//decrements timer's minutes property by one and updates minutes display
breakTimer.decMinutes = function() {
  if (breakTimer.minutesSet - 1 >= 0) {
    breakTimer.minutesSet--;
    console.log('breakTimer.minutesSet: ' + breakTimer.minutesSet);
    breakTimer.displayMinutes();
  }
  //updates remaining time display
  if (breakTimer.isActive && !breakTimer.isCountingDown) {
    breakTimer.milliseconds = breakTimer.minutesSet * 60000;
    breakTimer.remainingTime = convertTime(breakTimer.milliseconds);
    breakTimer.displayRemainingTime();
  }
}

//increments timer's minutes property by one and updates minutes display
sessionTimer.incMinutes = function() {
  sessionTimer.minutesSet++;
  console.log('sessionTimer.minutesSet: ' + sessionTimer.minutesSet);
  sessionTimer.displayMinutes();
  if (sessionTimer.isActive && !sessionTimer.isCountingDown) {
    sessionTimer.milliseconds = sessionTimer.minutesSet * 60000;
    sessionTimer.remainingTime = convertTime(sessionTimer.milliseconds);
    sessionTimer.displayRemainingTime();
  }
};

//decrements timer's minutes property by one and updates minutes display
sessionTimer.decMinutes = function() {
  if (sessionTimer.minutesSet - 1 >= 0) {
    sessionTimer.minutesSet--;
    console.log('sessionTimer.minutesSet: ' + sessionTimer.minutesSet);
    sessionTimer.displayMinutes();
  }
  if (sessionTimer.isActive && !sessionTimer.isCountingDown) {
    sessionTimer.milliseconds = sessionTimer.minutesSet * 60000;
    sessionTimer.remainingTime = convertTime(sessionTimer.milliseconds);
    sessionTimer.displayRemainingTime();
  }
}

//onclick listeners
var divClock = document.querySelector('.clock');
divClock.addEventListener('click', toggleTimer);

var iconBreakMinus = document.querySelector('.break-minus');
iconBreakMinus.addEventListener('click', breakTimer.decMinutes);
var iconBreakPlus = document.querySelector('.break-plus');
iconBreakPlus.addEventListener('click', breakTimer.incMinutes);
var iconSessionMinus = document.querySelector('.session-minus');
iconSessionMinus.addEventListener('click', sessionTimer.decMinutes);
var iconSessionPlus = document.querySelector('.session-plus');
iconSessionPlus.addEventListener('click', sessionTimer.incMinutes);