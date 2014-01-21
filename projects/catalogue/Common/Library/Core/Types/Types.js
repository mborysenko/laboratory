/*! @namespace {SDL.Client.Type} */
if (!window.SDL) SDL = {};
if (!SDL.Client) SDL.Client = {Types: {}};
if (!SDL.Client) SDL.Client = { UI: {} };

Array.prototype.isArray = true;
Date.prototype.isDate = true;
Function.prototype.isFunction = true;

SDL.Client.Type = {
	registerNamespace: function SDL$Client$Type$registerNamespace(text)
	{
		var arr = text.split(".");
		var length = arr.length;

		if (length > 0)
		{
			var base = window;
			var partName;
			for (var i = 0, l = arr.length; i < l; i++)
			{
				if (base[partName = arr[i]])
				{
					base = base[partName];
				}
				else if (i == 0)
				{
					base = this._registerTopLevelNamespace(partName);
				}
				else
				{
					base[partName] = {};
					base = base[partName];
				}
			}
		}
	},
	_registerTopLevelNamespace: function SDL$Client$Type$registerNamespace()
	{
		// no window's property, which may cause circular references and memory leaks
		// no argument names nor local variables to prevent name conflicts to make sure the variable is global
		return window.eval(arguments[0] + "={}");
	},
	resolveNamespace: function SDL$Client$Type$resolveNamespace(typeName)
	{
		var typeNames = typeName.split(".");
		var base = window;
		for (var i = 0, l = typeNames.length; i < l && base; i++)
		{
			base = base[typeNames[i]];
		}
		return base;
	},

	/**
	 * Returns a value indicating whether the supplied value is an array.
	 * @return {Boolean} <c>true</c> if the supplied value is an array, otherwise <c>false</c>.
	 */
	isArray: function SDL$Client$Type$isArray(value)
	{
		return (value &&
				(value.isArray ||
					(
						// return true for 'arguments' object and arrays created in other windows too
						this.isObject(value) && this.isNumber(value.length) && !this.isNumber(value.nodeType) && !SDL.jQuery.isWindow(value)
					)
				)
			) || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a date.
	 * @return {Boolean} <c>true</c> if the supplied value is an date, otherwise <c>false</c>.
	 */
	isDate: function SDL$Client$Type$isDate(value)
	{
		return value && value.isDate || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a boolean.
	 * @return {Boolean} <c>true</c> if the supplied value is a boolean, otherwise <c>false</c>.
	 */
	isBoolean: function SDL$Client$Type$isBoolean(value)
	{
		return typeof value === "boolean" ||
			(typeof value == "object" && value !== null && this.isFunction(value.valueOf) && (typeof value.valueOf() === "boolean"));
	},

	/**
	 * Returns a value indicating whether the supplied value is a function.
	 * @return {Boolean} <c>true</c> if the supplied value is a function, otherwise <c>false</c>.
	 */
	isFunction: function SDL$Client$Type$isFunction(value)
	{
		return (value && value.isFunction == true) || false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a number.
	 * @return {Boolean} <c>true</c> if the supplied value is a number, otherwise <c>false</c>.
	 */
	isNumber: function SDL$Client$Type$isNumber(value)
	{
		return typeof value === "number" ||
			(typeof value == "object" && value !== null && !this.isDate(value) && this.isFunction(value.valueOf) && (typeof value.valueOf() === "number"));
	},

	/**
	 * Returns a value indicating whether the supplied value is an object.
	 * @return {Boolean} <c>true</c> if the supplied value is an object, otherwise <c>false</c>.
	 */
	isObject: function SDL$Client$Type$isObject(value)
	{
		if (typeof value == 'object' && value !== null)
		{
			if (!this.isDate(value) && this.isFunction(value.valueOf))
			{
				var typeOfValue = typeof value.valueOf();
				return typeOfValue !== "number" && typeOfValue !== "string" && typeOfValue !== "boolean";
			}
			return true;
		}
		return false;
	},

	/**
	 * Returns a value indicating whether the supplied value is a string.
	 * @return {Boolean} <c>true</c> if the supplied value is a string, otherwise <c>false</c>.
	 */
	isString: function SDL$Client$Type$isString(value)
	{
		return typeof value === "string" ||
			(typeof value == "object" && value !== null && this.isFunction(value.valueOf) && (typeof value.valueOf() === "string"));
	},

	/**
	 * Returns a value indicating whether the supplied value is an xml or html node.
	 * @return {Boolean} <c>true</c> if the supplied value is an xml or html node, otherwise <c>false</c>.
	 */
	isNode: function SDL$Client$Type$isNode(value)
	{
		return typeof value == 'object' && value !== null && this.isNumber(value.nodeType);
	},

	/**
	 * Returns a value indicating whether the supplied value is an HTML element.
	 * @return {Boolean} <c>true</c> if the supplied value is an HTML element, otherwise <c>false</c>.
	 */
	isHtmlElement: function SDL$Client$Type$isHtmlElement(value)
	{
		return this.isElement(value) && (typeof value.style == "object") && value.style !== null;
	},

	/**
	 * Returns a value indicating whether the supplied value is an element.
	 * @return {Boolean} <c>true</c> if the supplied value is an element, otherwise <c>false</c>.
	 */
	isElement: function SDL$Client$Type$isElement(value)
	{
		return this.isNode(value) && value.nodeType == 1;
	},

	/**
	 * Returns a value indicating whether the supplied value is an xml or html document.
	 * @return {Boolean} <c>true</c> if the supplied value is an xml or html document, otherwise <c>false</c>.
	 */
	isDocument: function SDL$Client$Type$isDocument(value)
	{
		return this.isNode(value) && value.nodeType == 9;
	}
};