(function($)
{
	var orig_inArray = $.inArray;
	$.inArray = function SDL$Client$Types$Array$indexOf(value, array, fromIndex, compareFunc)
	{
		if (!compareFunc)
		{
			return orig_inArray.apply(this, arguments);
		}
		else
		{
			for (var len = array.length, i = (fromIndex ? (fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex) : 0); i < len; i++)
			{
				if ((i in array) && compareFunc(array[i], value))
				{
					return i;
				}
			}
			return -1;
		}
	};
})(SDL.jQuery);
/*! @namespace {SDL.Client.Types.Array} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Array");

/**
 * Returns an array of arguments.
 * Use this method to extract the arguments for use in functions that operate on either a single argument or on
 * multiple arguments, packed in an array and passed in as a single argument.
 * @param {Array} args The original arguments object.
 * @param {Number} startIndex The index from which to start copying. Optional.
 * @param {Number} stopIndex The index before which to stop copying. Optional.
 * @example var params = Array.fromArguments(arguments);
 * @example var params = Array.fromArguments(arguments, 1);
 * @example var params = Array.fromArguments(arguments, 0, 1);
 */
SDL.Client.Types.Array.fromArguments = function SDL$Client$Types$Array$fromArguments(args, startIndex, stopIndex)
{	
	var result = [];
	var start = startIndex || 0;

	if (args == null)
	{
		return result;
	}

	if (SDL.Client.Type.isArray(args[start]))
	{
		result = args[start];
	}
	else
	{
		var stop = SDL.Client.Type.isNumber(stopIndex) ? stopIndex : args.length;
		for (var i = start; i < stop; i++)
		{
			result.push(args[i]);
		}
	}

	return result;
};

/**
* Creates a copy of the passed array in the local context of the caller.
* @param {Array} array The array to clone.
* @return {Array} The cloned array.
*/
SDL.Client.Types.Array.clone = function SDL$Client$Types$Array$clone(array)
{
	if (SDL.Client.Type.isArray(array))
	{
		var clonedArray = [];
		for (var i = 0, len = array.length; i < len; i++)
		{
			clonedArray.push(array[i]);
		}
		return clonedArray;
	}
};

/**
* Returns a value indicating whether these arrays contains the same values.
* @param {Array} array The first array to check.
* @param {Array} array The second array to check.
* @return {Boolean} <c>true</c> if these arrays are equal, otherwise <c>false</c>.
*/
SDL.Client.Types.Array.areEqual = function SDL$Client$Types$Array$areEqual(array1, array2)
{
	if (array1 == array2)
	{
		return true;
	}
	else if (SDL.Client.Type.isArray(array1) && SDL.Client.Type.isArray(array2))
	{
		array1 = this.normalize(array1.slice());
		array2 = this.normalize(array2.slice());
		if (array1.length == array2.length)
		{
			for (var i = 0, l = array1.length; i < l; i++)
			{
				if (array1[i] !== array2[i])
				{
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

/**
* Returns true if the specified value is found within the array
* @param {Array} array The array to be searched.
* @param {Object} value The value to look for.
* @param {Function} compareFunc The compare function.
* @return {Boolean} True if the value has been found
*/
SDL.Client.Types.Array.contains = function SDL$Client$Types$Array$contains(array, value, compareFunc)
{
	return SDL.jQuery.inArray(value, array, 0, compareFunc) != -1;
};

SDL.Client.Types.Array.normalize = function SDL$Client$Types$Array$normalize(array)
{
	array = array.sort();
	for (var i = array.length - 2; i >= 0; i--)
	{
		if (array[i] === array[i + 1])
		{
			this.removeAt(array, i);
		}
	}
	return array;
};

SDL.Client.Types.Array.removeAt = function SDL$Client$Types$Array$removeAt(array, index)
{
	if (index < 0)
	{
		return;
	}
	var l = array.length;
	if (index < l)
	{
		array.splice(index, 1);
	}
};

/**
	* Moves a value to another position within this array
*/
SDL.Client.Types.Array.move = function SDL$Client$Types$Array$move(array, fromIndex, toIndex)
{
	if (fromIndex < 0 || toIndex < 0 || fromIndex == toIndex)
	{
		return;
	}

	var l = array.length;
	if (fromIndex >= l || toIndex >= l)
	{
		return;
	}

	var tmp = array[fromIndex];
	if (fromIndex < toIndex)
	{
		for(var i = fromIndex; i < toIndex; i++)
		{
			array[i] = array[i+1];
		}

	}
	else
	{
		for(var i = fromIndex; i > toIndex; i--)
		{
			array[i] = array[i-1];
		}
	}
	array[toIndex] = tmp;
};

SDL.Client.Types.Array.insert = function SDL$Client$Types$Array$insert(array, value, index)
{
	var i = array.length;
	if (i > index)
	{
		do
		{
			this[i] = this[i-1];
			i--;
		}
		while (i > index);
	}
	this[i] = value;
};