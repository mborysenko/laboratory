/*! @namespace {SDL.Client.Types.String} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.String");

// all unicode characters are split into bytes and each byte is represented by a single character
SDL.Client.Types.String.utf8encode = function SDL$Client$Types$String$utf8encode(string)
{
	if (string)
	{
		var b10000000 = 0x80;
		var b11000000 = 0xC0;
		var b11100000 = 0xE0;
		var b11110000 = 0xF0;
		var b00111111 = 0x3F;
		var b00011111 = 0x1F;
		var b00001111 = 0x0F;
		var b00000111 = 0x07;

		return string.replace(/[\u0080-\uffff]/g, function(c)
		{
			var c = c.charCodeAt(0);
			if (c <= 0x7ff)	// c >= 0x80
			{
				return String.fromCharCode(
					b11000000 | (b00011111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else if (c <= 0xffff)
			{
				return String.fromCharCode(
					b11100000 | (b00001111 & (c >>> 12)),
					b10000000 | (b00111111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else if (c <= 0x10ffff)
			{
				return String.fromCharCode(
					b11110000 | (b00000111 & (c >>> 18)),
					b10000000 | (b00111111 & (c >>> 12)),
					b10000000 | (b00111111 & (c >>> 6)),
					b10000000 | (b00111111 & c));
			}
			else
			{
				return c;
			}
		})
	}
	else
	{
		return string;
	}
};

SDL.Client.Types.String.base64encode = function SDL$Client$Types$String$base64encode(string)
{
	if (string)
	{
		string = this.utf8encode(string);

		var i2a  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var length = string.length;
		var groupCount = Math.floor(length/3);
		var remaining = length - 3 * groupCount;
		var result = [];

		var idx = 0;
		for (var i = 0; i < groupCount; i++)
		{
			var b0 = string.charCodeAt(idx++);
			var b1 = string.charCodeAt(idx++);
			var b2 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f | (b1 >> 4)],
				i2a[(b1 << 2) & 0x3f | (b2 >> 6)],
				i2a[b2 & 0x3f]);
		}

		if (remaining == 1)
		{
			var b0 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f],
				"==");
		}
		else if (remaining == 2)
		{
			var b0 = string.charCodeAt(idx++);
			var b1 = string.charCodeAt(idx++);
			result.push(
				i2a[b0 >> 2],
				i2a[(b0 << 4) & 0x3f | (b1 >> 4)],
				i2a[(b1 << 2) & 0x3f],
				'=');
		}
		return result.join("");
	}
	else
	{
		return string;
	}
};


/**
* Replaces the designated placeholders in supplied string with the supplied arguments.
* <p>Any arguments that follow the <c>value</c> argument will be interpreted as values to
* replace the template string with.</p>
* <p>The format of a placeholder is the zero-based index of the value to insert, surrounded with
* braces: <c>{0}</c>. Additionally, the format placeholders can contain padding instructions for both strings
* and numbers. Placeholder <c>{0#4-}</c> indicates that the value should be padded with zeros on its left side
* until its total length reaches 4. Placeholder <c>{0$10+}</c> indicates that the value should be padded with
* spaces on its right side until its total length reaches 10. {{ and }} output { and } respectively.</p>
* <p>Examples: <br/>
* <code>String.format("Hello mister {0}", "John"); // outputs: Hello mister John</code>
* <code>String.format("The cost of {0} is {1#4-}", "Apples", 2); // outputs: The cost of Apples is 0002.</code>
* <code>String.format("Character: {0$4-}.", "A"); // outputs: Character:   A.</code>
* <code>String.format("Escaped {{0}}"); // outputs: Escaped {0}</code>
* </p>
* @param {String} value The template string to replace.
* @arguments {Object} [1...n] The values to insert into the template string. Additionally, if the first argument is an array,
* it will be used as the arguments array.
* @return The formatted string.
*/
SDL.Client.Types.String.format = function SDL$Client$Types$String$format(value)
{
	var args = SDL.Client.Types.Array.fromArguments(arguments, 1);

	function applyPadding(string, count, character, direction) 
	{
		var string = '' + string;
		var diff = count - string.length;
		var output = new String();
		while (output.length < diff)
		{
			output += character;
		}

		return (direction == 2 ? string + output : output + string);
	}
	function applyFormat() 
	{
		var value;
		if (arguments[1])
		{
			value = "{";
		}
		else if (arguments[2])
		{
			value = "}";
		}
		else
		{
			if (args[arguments[3]] == undefined)
			{
				value = "";
			}
			else
			{
				value = new String(args[arguments[3]]);
				if (arguments[4] != "" && arguments[5] != "")
				{
					var direction = arguments[6] == "+" ? 2 : 1;
					value = applyPadding(value, arguments[5], arguments[4] == "#" ? "0" : " ", direction);
				}
			}
		}
		return value;
	}

	// compile and save the regex when needed and not before
	if (this.$rxFormat == null)
	{
		this.$rxFormat = /\{(\{)|(\})\}|\{(\d+)([$#])?(\d+)?([+-])?\}/g;
	}

	return (String(value).replace(this.$rxFormat, applyFormat));
};