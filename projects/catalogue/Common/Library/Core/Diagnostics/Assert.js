/*! @namespace {SDL.Client.Diagnostics.Assert} */
SDL.Client.Type.registerNamespace("SDL.Client.Diagnostics.Assert");

/**
 * Asserts that the supplied value is <code>true</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isTrue = function SDL$Client$Diagnostics$Assert$isTrue(value, description)
{
	if (value !== true)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be true."), value));
	}
};

/**
 * Asserts that the supplied value is <code>false</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isFalse = function SDL$Client$Diagnostics$Assert$isFalse(value, description)
{
	if (value !== false)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be false."), value));
	}
};

/**
 * Asserts that the supplied value is a <code>boolean</code>, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isBoolean = function SDL$Client$Diagnostics$Assert$isBoolean(value, description)
{
	if (!SDL.Client.Type.isBoolean(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be a boolean."), value));
	}
};

/**
 * Asserts that the supplied value is defined, and it throws an Error if it isn't.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isDefined = function SDL$Client$Diagnostics$Assert$isDefined(value, description)
{
	if (value === undefined)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Expression should be defined."), value));
	}
};

/**
 * Asserts that the supplied value is not <code>null</code>, and it throws an Error if it is.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNotNull = function SDL$Client$Diagnostics$Assert$isNotNull(value, description)
{
	if (value === null)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should not be null."), value));
	}
};

/**
 * Asserts that the supplied value is not <code>null</code> or <code>undefined</code>, and it throws an Error if it is.
 * @param {Object} value The value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNotNullOrUndefined = function SDL$Client$Diagnostics$Assert$isNotNullOrUndefined(value, description)
{
	if (value == null)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should not be null or undefined."), value));
	}
};

/**
 * Asserts that the supplied value1 and value2 are equal, and it throws an Error if they aren't.
 * @param {Object} value1 First value to check.
 * @param {Object} value2 Second value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.areEqual = function SDL$Client$Diagnostics$Assert$areEqual(value1, value2, description)
{
	if (value1 !== value2)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Values should be equal."), value1, value2));
	}
};

/**
 * Asserts that the supplied value1 and value2 are not equal, and it throws an Error if they aren't.
 * @param {Object} value1 First value to check.
 * @param {Object} value2 Second value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.areNotEqual = function SDL$Client$Diagnostics$Assert$areNotEqual(value1, value2, description)
{
	if (value1 === value2)
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Values should not be equal."), value1, value2));
	}
};

/**
 * Asserts that the supplied value is a string, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isString = function SDL$Client$Diagnostics$Assert$isString(value, description)
{
	if (!SDL.Client.Type.isString(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a string."), value));
	}
};

/**
 * Asserts that the supplied value is a number, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNumber = function SDL$Client$Diagnostics$Assert$isNumber(value, description)
{
	if (!SDL.Client.Type.isNumber(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a number."), value));
	}
};

/**
* Asserts that the supplied value is a date, and it throws an Error if it isn't.
* @param {Object} value A value to check.
* @param {String} description Optional description of this assertion.
* @return {Boolean} The result of assertion.
*/
SDL.Client.Diagnostics.Assert.isDate = function SDL$Client$Diagnostics$Assert$isDate(value, description)
{
	if (!SDL.Client.Type.isDate(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a date."), value));
	}
};

/**
 * Asserts that the supplied value is a number or can be converted to a number, and it throws an Error if negative.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNumeric = function SDL$Client$Diagnostics$Assert$isNumeric(value, description)
{
	if (!SDL.jQuery.isNumeric(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be numeric."), value));
	}
};

/**
 * Asserts that the supplied value is an object, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isObject = function SDL$Client$Diagnostics$Assert$isObject(value, description)
{
	if (!SDL.Client.Type.isObject(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be an object."), value));
	}
};

/**
 * Asserts that the supplied value is a array, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isArray = function SDL$Client$Diagnostics$Assert$isArray(value, description)
{
	if (!SDL.Client.Type.isArray(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be an array."), value));
	}
};

/**
 * Asserts that the supplied value is a function, and it throws an Error if it isn't.
 * @param {Object} value A value to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isFunction = function SDL$Client$Diagnostics$Assert$isFunction(value, description)
{
	if (!SDL.Client.Type.isFunction(value))
	{
		this.raiseError(SDL.Client.Types.String.format(description || ("Value should be a function."), value));
	}
};

/**
 * Asserts that the supplied object implements the specified interface, and it throws an Error if it doesn't.
 * @param {Object} object An object to check.
 * @param {Object} interfaceName The name of the interface that the specified object should implement.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.implementsInterface = function SDL$Client$Diagnostics$Assert$implementsInterface(object, interfaceName, description)
{
	if (!SDL.Client.Types.OO.implementsInterface(object, interfaceName))
	{
		this.raiseError(description || ("Object should implement " + interfaceName));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML node, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isNode = function SDL$Client$Diagnostics$Assert$isNode(object, description)
{
	if (!SDL.Client.Type.isNode(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a node.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isElement = function SDL$Client$Diagnostics$Assert$isElement(object, description)
{
	if (!SDL.Client.Type.isElement(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be an element node.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isHtmlElement = function SDL$Client$Diagnostics$Assert$isHtmlElement(object, description)
{
	if (!SDL.Client.Type.isHtmlElement(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be an html element.", object));
	}
};

/**
 * Asserts that the supplied object is an HTML or XML element, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isDocument = function SDL$Client$Diagnostics$Assert$isDocument(object, description)
{
	if (!SDL.Client.Type.isDocument(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a document node", object));
	}
};

/**
 * Asserts that the supplied object is a browser Window, and it throws an Error if it isn't.
 * @param {Object} object An object to check.
 * @param {String} description Optional description of this assertion.
 * @return {Boolean} The result of assertion.
 */
SDL.Client.Diagnostics.Assert.isWindow = function SDL$Client$Diagnostics$Assert$isWindow(object, description)
{
	if (!SDL.jQuery.isWindow(object))
	{
		this.raiseError(SDL.Client.Types.String.format(description || "Object should be a window.", object));
	}
};

SDL.Client.Diagnostics.Assert.raiseError = function SDL$Client$Diagnostics$Assert$raiseError(description)
{
	throw new Error(description);
};