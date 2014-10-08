/*! @namespace {SDL.Client.Types.Date} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Date");

/**
* Initialized when the code is first parsed with the milliseconds of the current moment.
* This variable can then be used for timing purposes.
* @type {Number}
*/
SDL.Client.Types.Date.initTime = new Date().getTime(),
	
/**
* Returns the number of milliseonds elapsed since another point in time.
* @param {Number} timeSince The millisecond representation of a time from which to measure the difference. If this
* value is not specified, the difference returned will be between the current moment and the time stored in <c>Date.initTime</c>
* @return {Number} The number of milliseonds elapsed since another point in time.
*/
SDL.Client.Types.Date.getTimer = function SDL$Client$Types$Date$getTimer(timeSince)
{
	return (new Date().getTime() - (timeSince || Date.initTime));
};

/**
* Tries to figure out if: startdate <= date <= endDate.
* @param {Date} date The date object to verify
* @param {Date} startDate The date object as the left limiter
* @param {Date} endDate The date object as the right limiter
* @return {Boolean} True is so, otheriwse false.
*/
SDL.Client.Types.Date.inRange = function SDL$Client$Types$Date$inRange(date, startDate, endDate)
{
	var sOk = SDL.Client.Type.isDate(startDate);
	var eOk = SDL.Client.Type.isDate(endDate);
		
	if ((!sOk && !eOk) ||
		(sOk && !eOk && ((startDate.getTime() - date.getTime()) <= 0)) ||
		(!sOk && eOk && ((date.getTime() - endDate.getTime()) <= 0)) ||
		(sOk && eOk && ((startDate.getTime() - date.getTime()) <= 0) && ((date.getTime() - endDate.getTime()) <= 0)))
	{
		return true;
	}
	else
	{
		return false;
	}
};