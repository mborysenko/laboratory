/*! @namespace {SDL.Client.Types.Object} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Object");

// differs from window.JSON.stringify in how Date is serialized
// JSON.parse(window.JSON.stringify(new Date())) will result in a string, while
// SDL.Client.Types.Object.deserialize(SDL.Client.Types.Object.serialize(new Date())) will yield a Date object
SDL.Client.Types.Object.serialize = function SDL$Client$Types$Object$serialize(object, handleDates)
{
	if (!handleDates && window.JSON && window.JSON.stringify)
	{
		return window.JSON.stringify(object);
	}
	else
	{
		var i;
		switch (typeof object)
		{
			case "object":
				if (object)
				{
					if (SDL.Client.Type.isArray(object))
					{
						var arr = [];
						for (var i = 0, l = object.length; i < l; i++)
						{
							var value = object[i];
							if (!value || !value.isFunction)
							{
								arr.push(SDL.Client.Types.Object.serialize(value));
							}
						}
						return "[" + arr.join(",") + "]";
					}
					else if (SDL.Client.Type.isDate(object))
					{
						return "\"\\/Date(" + object.getTime() + ")\\/\"";
					}
					else
					{
						var arr = [];
						for (var name in object)
						{
							var value = object[name];
							if (!value || !value.isFunction)
							{
								arr.push([SDL.Client.Types.Object.serialize(name), SDL.Client.Types.Object.serialize(object[name])].join(":"));
							}
						}
						return "{" + arr.join(",") + "}";
					}
				}
				else
				{
					return "null";
				}
				break;

			case "number":
				return String(object);

			case "string":
				if (navigator.userAgent.indexOf(" Safari/") > -1 || (/[\"\b\f\n\r\t\\\\\x00-\x1F]/i).test(object))
				{
					var arr = [];
					var length = object.length;
					for (i = 0; i < length; ++i)
					{
						var curChar = object.charAt(i);
						if (curChar >= " ")
						{
							if (curChar === "\\" || curChar === "\"")
							{
								arr.push("\\");
							}
							arr.push(curChar);
						}
						else
						{
							switch (curChar)
							{
								case "\b":
									arr.push("\\b");
									break;
								case "\f":
									arr.push("\\f");
									break;
								case "\n":
									arr.push("\\n");
									break;
								case "\r":
									arr.push("\\r");
									break;
								case "\t":
									arr.push("\\t");
									break;
								default:
									arr.push("\\u00");
									if (curChar.charCodeAt() < 16)
									{
										arr.push("0");
									}
									arr.push(curChar.charCodeAt().toString(16));
							}
						}
					}
					return "\"" + arr.join("") + "\"";
				}
				else
				{
					return "\"" + object + "\"";
				}

			case "boolean":
				return object.toString();

			default:
				return "null";
		}
	}
};

// differs from window.JSON.parse in the way it treats Date objects serialized with SDL.Client.Types.Object.serialize()
SDL.Client.Types.Object.deserialize = function SDL$Client$Types$Object$deserialize(text, handleDates)
{
	if (text.length == 0)
	{
		return undefined;
	}
	else if (!handleDates && window.JSON && window.JSON.parse)
	{
		return window.JSON.parse(text);
	}
	else
	{
		if (this.rxpDeserialize == null)
		{
			this.rxpSecureDeserialize = /\(/g;
			this.rxpDateDeserialize = /(^|[^\\])\"\\\/Date\\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\)\\\/\"/g;
		}

		return eval("(" + text.replace(this.rxpSecureDeserialize, "\\(").replace(this.rxpDateDeserialize, "$1new Date($2)") + ")");		
	}
};

/**
* Creates a shallow copy of the passed object in the local context of the caller.
* @param {Array} object The object to clone.
* @return {Array} The cloned object.
*/
SDL.Client.Types.Object.clone = function SDL$Client$Types$Object$clone(object)
{
	if (SDL.Client.Type.isObject(object))
	{
		var clonedObject = {};
		for (var i in object)
		{
			var k = (i == null ? "" : i);
			clonedObject[k] = object[k];
		}
		return clonedObject;
	}
	return (typeof object == "object" && object !== null && this.isFunction(object.valueOf)) ? object.valueOf() : object;
};

SDL.Client.Types.Object.find = function SDL$Client$Types$Object$find(object, value)
{
	if (object)
	{
		for (var p in object)
		{
			if (object[p] == value)
			{
				return p;
			}
		}
	}
};

SDL.Client.Types.Object.getUniqueId = function SDL$Client$Types$Object$getUniqueId(object)
{
	if (object)
	{
		if (SDL.jQuery.isWindow(object))
		{
			// create uniqueId under SDL namespace, to prevent creating a global variable
			if (!object.SDL)
			{
				object.SDL = {};
			}

			return object.SDL.uniqueID || (object.SDL.uniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
		else if (SDL.Client.Type.isDocument(object))	// uniqueID for a document in IE(8) is changing every time you ask for it
		{
			return object.documentUniqueID || (object.documentUniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
		else
		{
			return object.uniqueID || (object.uniqueID = "obj_" + SDL.Client.Types.Object.getNextId());
		}
	}
};

SDL.Client.Types.Object.getNextId = function SDL$Client$Types$Object$getNextId()
{
	return this.$$uniqueID ? ++this.$$uniqueID : (this.$$uniqueID = 1);
};