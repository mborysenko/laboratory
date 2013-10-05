/*! @namespace {SDL.Client.Types.Number} */
SDL.Client.Type.registerNamespace("SDL.Client.Types.Number");

SDL.Client.Types.Number.toNumber = function SDL$Client$Types$Number$toNumber(value)
{
	return Number(this.toNumberString(value));
};

SDL.Client.Types.Number.toNumberString = function SDL$Client$Types$Number$toNumberString(value)
{
	if (isNaN(Number(value)) && SDL.Client.Type.isString(value))
	{
		// convert japanese numbers
		return value.replace(/[\u3002\uff0e\uff0d\uff61\uff10-\uff19]/g, function(c)
		{
			var charCode = c.charCodeAt(0);
			switch (charCode)
			{
				case 0x3002:
				case 0xff0e:
				case 0xff61:
					return ".";
				case 0xff0d:
					return "-";
				default:
					return charCode - 0xff10;	//0xff10 -> '0'
			}
		});
	}
	return value;
};