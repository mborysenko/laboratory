(function () {
    /**
     * Initializes a new instance of the DatePicker control
     * 
     * @param {object} element The DOM element on which to apply the control
     * @param {object} options Configuration options for the control
     * {
     *      maxDate: {date} The maximum selectable date,
     *      minDate: {date} The minimum selectable date,
     *      yearRange: {number|array} The number of years either side of the selected date to show, or else an array containing two items, the start year and the end year to pass to Pikaday
     *      onMouseDown: {function} A custom callback to fire on mouse down of the Pikaday popup.
     * }
     */
    var DatePicker = function (element, options) {
        var self = this;

        self.element = element;
        self.options = options || {};

        // if it's a touch device, use the html5 date picker, otherwise we will use Pikaday
        self.usePikaday = !self._isTouchDevice();
        if (self.usePikaday) {
            self.initializePikadayDatePicker(self.element, self.options);
        } else {
            self.initializeHTML5DatePicker(self.element, self.options);
        }
    };

    /**
     * Returns the long date format to pass to moment for formatting the final display value
     * 
     * @param {string} culture the culture to get the long date format for 
     */
    DatePicker.prototype.getMomentLongDateFormatForCulture = function(culture) {
        switch (culture) {
            case 'en-US':
                return 'MMMM D, YYYY';
            default:
                return 'D MMMM YYYY';
        }
    };

    /**
     * Initializes an HTML5 native date picker on the element
     * 
     * @param {object} element The DOM element on which to apply the control
     * @param {object} options Configuration options for the control
     */
    DatePicker.prototype.initializeHTML5DatePicker = function(element, options) {
        element.setAttribute('type', 'date');

        if (options.maxDate) {
            element.setAttribute('max', SDL.Globalize.format(options.maxDate, 'yyyy-MM-dd'));
        }

        if (options.minDate) {
            element.setAttribute('min', SDL.Globalize.format(options.minDate, 'yyyy-MM-dd'));
        }
    };

    /**
     * Initializes the Pikaday date picker on the element
     * 
     * @param {object} element The DOM element on which to apply the control
     * @param {object} options Configuration options for the control
     */
    DatePicker.prototype.initializePikadayDatePicker = function(element, options) {
        var self = this;

        var currentCulture = SDL.Globalize.culture();
        var currentCultureName = SDL.Globalize.culture().name;
        var momentShortDateFormat = self.convertFromGlobalizeToMomentDatePattern(currentCulture.calendar.patterns.d); // used in as the placeholder text
        var momentLongDateFormat = self.getMomentLongDateFormatForCulture(currentCultureName); // used as the final display format

        element.classList.add('pikaday');
        element.setAttribute('type', 'text');
        element.setAttribute('placeholder', momentShortDateFormat);

        // extract i18n need for moment and pikaday info from the current culture
        var i18n = {
            months: currentCulture.calendar.months.names,
            weekdays: currentCulture.calendar.days.names,
            weekdaysShort: currentCulture.calendar.days.namesAbbr
        };

        // set the current locale that moment uses
        moment.lang(currentCultureName, i18n);

        // create the pikaday date picker
        var yearRange = options.yearRange;
        if (!yearRange && options.minDate && options.maxDate) {
            yearRange = [options.minDate.getFullYear(), options.maxDate.getFullYear()];
        }
        var originalValue = element.value; // prevent pikaday from trying to interpret invalid dates on initialization
        element.pikaday = new Pikaday({
            field: element,
            firstDay: currentCulture.calendar.firstDay,
            maxDate: options.maxDate,
            minDate: options.minDate,
            yearRange: yearRange,
            i18n: i18n,
            position: 'bottom left',
            format: momentLongDateFormat,
            onSelect: function() { self.isValid(true); },
            container: Pikaday.prototype.getFirstScrollableAncestor(element)
        });

        // reset the date value (required when switching cultures)
        if (this.selectedDate) {
            element.pikaday.setDate(this.selectedDate);
        } else {
            element.value = originalValue;
            var date = moment(originalValue, momentLongDateFormat);
            if (date.isValid()) {
                element.pikaday.setDate(date.toDate());
                self.isValid(true);
            } else {
                element.value = originalValue;
                var thisYear = (new Date()).getFullYear();
                element.pikaday.gotoYear(thisYear);
                if (element.value === '') {
                    self.isValid(true);
                } else {
                    self.isValid(false);
                }
            }
        }

        // override the onInputChange event on the Pikaday plugin
        element.removeEventListener('change', element.pikaday._onInputChange);
        element.pikaday._onInputChange = function (e) {
            var pikaday = element.pikaday;

            if (e.firedBy === pikaday) {
                return;
            }

            if (element.value) {
                // try long date format (as per final display value)
                var longDate = moment(element.value, momentLongDateFormat, true);
                if (longDate.isValid()) {
                    self.isValid(true);
                    pikaday.setDate(longDate.toDate());
                } else {
                    // try to parse short date format (as per placeholder text)
                    var shortDate = moment(element.value, momentShortDateFormat, true);
                    if (shortDate.isValid()) {
                        self.isValid(true);
                        pikaday.setDate(shortDate.toDate());
                    } else {
                        // try to parse short date format with single digit month and day
                        var momentShortDateFormatSingleDigitDayAndMonth = momentShortDateFormat.replace('DD', 'D').replace('MM', 'M');
                        shortDate = moment(element.value, momentShortDateFormatSingleDigitDayAndMonth, true);
                        if (shortDate.isValid()) {
                            self.isValid(true);
                            pikaday.setDate(shortDate.toDate());
                        } else {
                            self.isValid(false);
                        }
                    }
                }
            } else {
                self.isValid(true);
            }
        };
        element.addEventListener('change', element.pikaday._onInputChange);

        // we remove invalid styling on key down if the value is blank otherwise it's hard to see the placeholder text against the invalid background colour
        this.onInput = function () {
            if (element.value === '') {
                self.isValid(true);
            }
        };
        element.addEventListener('input', this.onInput);

        // if we passed in an onMouseDown handler, then hook it up
        if (typeof options.onMouseDown === 'function') {
            element.pikaday.el.addEventListener('mousedown', options.onMouseDown);
        }

        // hide the date picker on window blur
        element.hidePikaday = function () {
            element.pikaday.hide();
        };
        window.addEventListener('blur', element.hidePikaday);

        // hide the date picker on ESC key
        element.hidePikadayOnKeyEsc = function (event) {
            if (event.keyCode === 27) {
                element.pikaday.hide();
            }
        };
        element.addEventListener('keydown', element.hidePikadayOnKeyEsc);

        // listen for culture change events
        self.onCultureChange = self.onCultureChange || function () {
            self.dispose();
            self.initializePikadayDatePicker(element, self.options);
        };
        SDL.Globalize.addEventListener("culturechange", self.onCultureChange);
    };

    /**
     * Returns true if the date picker contains a valid date, otherwise false
     * 
     * @param {boolean} isValid sets the valid nature of the date picker 
     */
    DatePicker.prototype.isValid = function (isValid) {
        if (typeof isValid === "boolean") {
            if (isValid) {
                this.element.classList.remove('invalid');
            } else {
                this.element.classList.add('invalid');
            }

            this._isValid = isValid;
        }

        return this._isValid;
    };

    /**
     * Converts from a Globalize date pattern to a Moment.js date pattern
     * Doesn't work with time components currently
     * Ref: https://github.com/jquery/globalize/blob/master/doc/api/date/format.md
     * Ref: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * Ref: http://momentjs.com/docs/#/i18n/
     * 
     * @param {string} globalizeDateFormat the Globalize date format to convert
     */
    DatePicker.prototype.convertFromGlobalizeToMomentDatePattern = function (globalizeDateFormat) {
        
        globalizeDateFormat = globalizeDateFormat.toUpperCase();

        return globalizeDateFormat
            .replace(/(^|[^M])(M)($|[^M])/, "$1MM$3")
            .replace(/(^|[^D])(D)($|[^D])/, "$1DD$3")
            .replace(/(^|[^Y])(Y)($|[^Y])/, "$1YYYY$3")
            .replace(/(^|[^Y])(YY)($|[^Y])/, "$1YYYY$3");
    };

    /**
     * This render method is required by Lucia/Catalina, see http://jira.global.sdl.corp:8090/confluence/display/DEV/Views+and+controls
     */
    DatePicker.prototype.render = function (callback) {
        if (typeof callback === 'function') {
            callback();
        }
    };

    /**
     * Updates the options for the control 
     * 
     * @param {object} options Configuration options for the control
     */
    DatePicker.prototype.update = function (options) {
        this.options = options;
        if (this.usePikaday) {
            if (options) {
                if (options.maxDate) {
                    this.element.pikaday.setMaxDate(options.maxDate);
                } else {
                    this.element.pikaday.setMaxDate(null);
                }

                if (options.maxDate) {
                    this.element.pikaday.setMaxDate(options.maxDate);
                } else {
                    this.element.pikaday.setMaxDate(null);
                }
            }
        } else {
            this.initializeHTML5DatePicker(this.element, this.options);
        }
    };

    /**
     * Disposes of the control
     */
    DatePicker.prototype.dispose = function () {
        if (this.usePikaday) {
            // store the selected date so it can be restored on culture change
            if (this.isValid() && this.element.value !== '') {
                this.selectedDate = this.element.pikaday.getDate();
            } else {
                this.selectedDate = null;
            }

            // clean up
            SDL.Globalize.removeEventListener("culturechange", this.onCultureChange);
            window.removeEventListener('blur', this.element.hidePikaday);
            if (typeof this.options.onMouseDown === 'function') {
                this.element.pikaday.el.removeEventListener('mousedown', this.options.onMouseDown);
            }
            this.element.pikaday.destroy();
            this.element.removeEventListener('input', this.onInput);
            this.element.removeEventListener('keydown', this.element.hidePikadayOnKeyEsc);
        }
    };

    /**
     * Returns true if we are on a touch device, otherwise returns false
     */
    DatePicker.prototype._isTouchDevice = function() {
        return 'ontouchstart' in window || navigator.msMaxTouchPoints;
    };

    // Lucia/Catalina namespace
    SDL = SDL || {};
    SDL.UI = SDL.UI || {};
    SDL.UI.Controls = SDL.UI.Controls || {};
    SDL.UI.Controls.DatePicker = DatePicker;
}());