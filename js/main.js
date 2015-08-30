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

//center svg circle
var scrnWidth = window.screen.width;
var circle = document.querySelector('circle');
//to center the circle horizontally, I need to offset mid screen by circle r
circle.setAttribute('cx', scrnWidth / 2 - 120);
//used by animate() func
var count = 0;

//helper
//given selector, returns css rule to update
//I'm only interested in the 3rd stylesheet so skipping the loop to iterate over all 5 stylesheets 
function getStyleSheet(unique_title) {
  var sheet = document.styleSheets[2];
  console.log('sheet: ' + sheet);
  console.log('sheet.cssRules: ' + sheet.cssRules);
  var rules = sheet.cssRules;
  console.log('rules: ' + rules);

  // for (var i = 0; i < document.styleSheets.length; i++) {
  //   var sheet = document.styleSheets[i];
  //   console.log('sheet: ' + sheet);
  //   console.log('sheet length: ' + document.styleSheets.length);
   for (var ix = 0; ix < rules.length; ix++) {
     if (rules[ix].selectorText === unique_title) {
       return rules[ix].style;
     }
   }
  // }
}

//helper
//takes top value in string format; removes 'px' and returns the num value
function topStrToNum(str) {
  var idxPx = str.indexOf('px');
  var cleanStr = str.slice(0, idxPx);
  return parseInt(cleanStr);
}

var topOrig = getStyleSheet('.rect').top; 
console.log('topOrig: ' + topOrig);
var topOrigNum = topStrToNum(topOrig);

//animates circle fill on last second of active timer
function animate() {
  count++;
  console.log('count: ' + count);
  var increment = 2; //120 / 60
  var topVal = topOrigNum - (count * increment);
  console.log('topVal: ' + topVal);
  var rule = getStyleSheet('.rect');
  rule.top = topVal.toString() + 'px';
}

//sat 5:30p this is not working
var rectIntervalId = setInterval(animate, 1000);

//this is for testing currently, to stop the animation
//clearInterval(rectIntervalId);

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