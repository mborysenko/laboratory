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

SDL.Client.Types.Date.toString = function(date, format, formatLocale)
{
	if (date)
	{
		if (format == null)
		{
			return date.toString(date);
		}

		if (isNaN(date))
		{
			return "NaN";
		}

		var d = date.getDate();
		var day = date.getDay();
		var month = date.getMonth();
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var milliseconds = date.getMilliseconds()
		var offset = date.getTimezoneOffset();

		var formatted = format.replace(/d{1,4}|M{1,4}|y{4}|y{2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|z{1}|\'[^\']*\'/g, function($1)
		{
			switch ($1)
			{
				case "d":
					return d;
				case "dd":
					return (d < 10) ? "0" + d : d;
				case "ddd":
					return formatLocale.shortDayNames[day];
				case "dddd":
					return formatLocale.dayNames[day];
				case "M":
					return month + 1;
				case "MM":
					return (month < 9) ? "0" + (month + 1) : (month + 1);
				case "MMM":
					return formatLocale.shortMonthNames[month];
				case "MMMM":
					return formatLocale.monthNames[month];
				case "yy":
					var y = year % 100
					return (y < 10) ? "0" + y : y;
				case "yyyy":
					return year;
				case "H":
					return hours;
				case "HH":
					return (hours < 10) ? "0" + hours : hours;
				case "h":
					var h = (hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours));
					return h;
				case "hh":
					var h = (hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours));
					return (h < 10) ? "0" + h : h;
				case "m":
					return minutes;
				case "mm":
					return (minutes < 10) ? "0" + minutes : minutes;
				case "s":
					return seconds;
				case "ss":
					return (seconds < 10) ? "0" + seconds : seconds;
				case "f":
					return Math.round(milliseconds / 100);
				case "ff":
					var ms = Math.round(milliseconds / 10);
					return (ms < 10) ? "0" + ms : ms;
				case "fff":
					return (milliseconds < 10) ? "00" + milliseconds :
						(milliseconds < 100) ? "0" + milliseconds :
						milliseconds;
				case "t":
					return (hours < 12 ? formatLocale.am : formatLocale.pm).slice(0, 1);
				case "tt":
					return hours < 12 ? formatLocale.am : formatLocale.pm;
				case "z":
					var offset_hours = Math.floor(Math.abs(offset) / 60);
					var offset_minutes = Math.abs(offset) - (offset_hours * 60);
					var oh = offset_hours < 10 ? "0" + offset_hours : offset_hours;
					var om = offset_minutes < 10 ? "0" + offset_minutes : offset_minutes;
					return ("UTC" + (offset > 0 ? "-" : "+") + oh + om);
				default:
					return $1.replace(/\'/g, "");
			}
		});

		return formatted;
	}
};