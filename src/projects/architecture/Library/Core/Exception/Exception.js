/*! @namespace {SDL.Client.Exception.Exception} */
SDL.Client.Types.OO.createInterface("SDL.Client.Exception.Exception");

SDL.Client.Exception.Exception.$constructor = function SDL$Client$Exception$constructor(errorCode, message, description)
{
	var p = this.properties;
	p.errorCode = errorCode;
	p.message = message;
	p.description = description;
};

SDL.Client.Exception.Exception.prototype.getErrorCode = function SDL$Client$Exception$getErrorCode()
{
	return this.properties.errorCode;
};

SDL.Client.Exception.Exception.prototype.getMessage = function SDL$Client$Exception$getMessage()
{
	return this.properties.message;
};

SDL.Client.Exception.Exception.prototype.getDescription = function SDL$Client$Exception$getDescription()
{
	return this.properties.description;
};

SDL.Client.Exception.ErrorCodes = {};	// enum of error codes

(function()
{
	var next = 1;
	SDL.Client.Exception.registerErrorCode = function SDL$Client$Exception$registerErrorCode(alias)
	{
		if (!SDL.Client.Exception.ErrorCodes[alias])
		{
			SDL.Client.Exception.ErrorCodes[alias] = next++;
		}
	}
})();