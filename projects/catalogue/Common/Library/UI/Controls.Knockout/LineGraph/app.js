var app =
{
	constants:
	{
		date:
		{
			MILLISECONDS_IN_DAY: 1000*60*60*24
		}
	},

	locale:
	{
		localize: function(res)
		{
			switch (res)
			{
				case "":
					return;
				case "":
					return;
				case "CampaignMetrics.Goal":
					return "Goal";
				case "CampaignMetrics.GoalReached":
					return "Goal line crossed at";
				case "CampaignMetrics.Today":
					return "today";
				default:
					return res;
			}
		},

		format: function (value, format)
		{
			return SDL.Globalize.format(value, format);
		},

		formatDecimal: function(number)
		{
			if (typeof number !== 'string')
			{
				number = number.toString();
			}

			var digitsAfterDecimal = number.split(".")[1];
			var globalizeNumberModifier = 'n';
			if (digitsAfterDecimal)
			{
				globalizeNumberModifier += digitsAfterDecimal.length;
			}
			else
			{
				globalizeNumberModifier += '0';
			}

			return this.format(parseFloat(number), globalizeNumberModifier);
		}
	},

	utils:
	{
		/**
			returns the number of days between two dates
			@param {date} date1 The first date
			@param {date} date2 The second date
		*/
		daysBetween: function(date1, date2)
		{
			return Math.round(Math.abs((date1.getTime() - date2.getTime()) / app.constants.date.MILLISECONDS_IN_DAY));
		},

		/**
			Returns true if the value is null or undefined, otherwise returns false
			@param {object} value The value to test
			@return {boolean} true if value is null or undefined, otherwise false
		*/
		isNullOrUndefined: function (value)
		{
			return value === null || typeof (value) === "undefined";
		},

		number:
		{
			/**
				defines a set of multipliers for SI unit conversion
			*/
			multipliers: [
				{ value: 1e24, suffix: 'Y' },
				{ value: 1e21, suffix: 'Z' },
				{ value: 1e18, suffix: 'E' },
				{ value: 1e15, suffix: 'P' },
				{ value: 1e12, suffix: 'T' },
				{ value: 1e9, suffix: 'G' },
				{ value: 1e6, suffix: 'M' },
				{ value: 1e3, suffix: 'k' },
				{ value: 1e0, suffix: '' },
				{ value: 1e-3, suffix: 'm' },
				{ value: 1e-6, suffix: 'µ' },
				{ value: 1e-9, suffix: 'n' },
				{ value: 1e-12, suffix: 'p' },
				{ value: 1e-15, suffix: 'f' },
				{ value: 1e-18, suffix: 'a' },
				{ value: 1e-21, suffix: 'z' },
				{ value: 1e-24, suffix: 'y' }
			],
			/**
				converts a number to a short form using SI units using decimal place precision instead of number of digits
				@param {number} number the number to convert
				@param {number} decimalPlaces the number of decimal places to display
				@param {object} multiplier optional multiplier to use, otherwise calculated
			*/
			convertToSIUnitsUsingDecimalPlacePrecision: function (number, decimalPlaces, multiplier)
			{
				if (number < 0)
				{
					return '-' + app.utils.number.convertToSIUnitsUsingDecimalPlacePrecision(-number, decimalPlaces, multiplier);
				}

				if (number === 0)
				{
					return number;
				}

				if (app.utils.isNullOrUndefined(decimalPlaces))
				{
					decimalPlaces = 1;
				}

				if (app.utils.isNullOrUndefined(multiplier))
				{
					multiplier = this.getSIMultiplierFor(number);
				}

				// TFS: 26307 - don't use the milli "m" SI unit
				if (multiplier.suffix === "m")
				{
					multiplier = { value: 1, suffix: '' };
					//decimalPlaces = 3;
				}
				if (!app.utils.isNullOrUndefined(multiplier))
				{
					return app.locale.format((number / multiplier.value), 'n' + decimalPlaces) + multiplier.suffix;
				}

				return number.toExponential();
			},

			/**
				converts a number to a short form using SI units
				@param {number} number the number to convert
				@param {number} significantDigits the number of significant digits to display
				@param {object} multiplier optional multiplier to use, otherwise calculated
			*/
			convertToSIUnits: function(number, significantDigits, multiplier)
			{
				if (number < 0)
				{
					return '-' + app.utils.number.convertToSIUnits(-number, significantDigits, multiplier);
				}

				if (number === 0)
				{
					return number;
				}

				if (app.utils.isNullOrUndefined(significantDigits))
				{
					significantDigits = 3;
				}

				if (app.utils.isNullOrUndefined(multiplier))
				{
					multiplier = this.getSIMultiplierFor(number);
				}

				if (!app.utils.isNullOrUndefined(multiplier))
				{
					// TFS: 26307 - don't use the milli "m" SI unit
					if (multiplier.suffix === "m")
					{
						// resort to decimal place precision with 3dp
						return app.utils.number.convertToSIUnitsUsingDecimalPlacePrecision(number, 3, { value: 1, suffix: '' });
					}

					//globalize doesn't support significant digits, so we have to work it out in terms of decimal places ourselves
					var sigDigitRepresentation = (number / multiplier.value).toPrecision(significantDigits);
					var localizedResult = app.locale.formatDecimal(sigDigitRepresentation);

					return localizedResult + multiplier.suffix;
				}

				return number.toExponential();
			},

			/**
				gets the SI unit to use for this number
				@param {number} number The number to get the SI multiplier for
			*/
			getSIMultiplierFor: function(number)
			{
				if (number < 1e27 && number > 1e-27)
				{
					for (var i = 0; i < this.multipliers.length; i++)
					{
						if (number >= this.multipliers[i].value)
						{
							return this.multipliers[i];
						}
					}
				}

				return null;
			}
		}
	}
};

if (typeof Date.prototype.addDays !== "function") {
    /**
        returns a new date, adding a specified number of days to the date
        @param {number} days The number of days to add to the date
    */
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
}

if (typeof Date.prototype.isToday !== "function") {
    /**
        returns true if the date is today, otherwise false
        @param {date} date the date to check
    */
    Date.prototype.isToday = function () {
        var today = new Date();
        return today.getDate() === this.getDate() &&
            today.getMonth() === this.getMonth() &&
            today.getYear() === this.getYear();
    };
}

if (typeof Math.log10 !== "function") {
    Math.log10 = function (value) {
        return Math.log(value) / Math.LN10;
    };
}