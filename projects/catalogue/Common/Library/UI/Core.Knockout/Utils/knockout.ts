/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.Utils
{
	export function unwrapRecursive(value: any, maxDepth = 5): any
	{
		return _unwrapRecursive(value, maxDepth = 5, []);
	}

	function _unwrapRecursive(value: any, maxDepth: number, mappedValues: {value: any; result: any;}[]): any
	{
		var result: any;
		value = ko.unwrap(value);

		if (maxDepth <= 0 || !value || SDL.jQuery.isWindow(value) || SDL.Client.Type.isDate(value) || SDL.Client.Type.isNode(value) || SDL.Client.Type.isFunction(value))
		{
			result = value;
		}
		else
		{
			for (var i = 0; i < mappedValues.length; i++)
			{
				if (mappedValues[i].value == value)
				{
					result = mappedValues[i].value;
					break;
				}
			}

			if (!result)
			{
				if (SDL.Client.Type.isArray(value))
				{
					result = [];
				}
				else if (typeof value == 'object')
				{
					if ((value instanceof Boolean) || (value instanceof Number) || (value instanceof String))
					{
						result = new value.constructor(value);	// recreate if instance of Boolean, String or Number
					}
					else
					{
						result = {};
					}
				}

				if (result)
				{
					mappedValues.push({value: value, result: result});

					var changed = false;
					for (var p in value)
					{
						var k = (p == null ? "" : p);
						var unwrapped = result[k] = _unwrapRecursive(value[k], maxDepth - 1, mappedValues);
						changed = changed || (unwrapped != value[k]);
					}

					if (!changed)
					{
						result = value;
					}
				}
				else if (SDL.Client.Type.isFunction(value.valueOf))
				{
					result = value.valueOf();
				}
				else
				{
					result = value;
				}
			}
		}
		return result;
	}
}