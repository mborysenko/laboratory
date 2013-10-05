/*! @namespace {SDL.Client.Exception.ValidationException} */
SDL.Client.Types.OO.createInterface("SDL.Client.Exception.ValidationException");

SDL.Client.Exception.registerErrorCode("VALIDATION_ERROR");

SDL.Client.Exception.ValidationException.$constructor = function SDL$Client$ValidationException$constructor(validationResults)
{
	this.addInterface("SDL.Client.Exception.Exception", [SDL.Client.Exception.ErrorCodes.VALIDATION_ERROR, "Validation failed.", null]);
	var p = this.properties;
	if (validationResults)
	{
		p.validationResults = SDL.Client.Types.Object.clone(validationResults);
		p.empty = false;
	}
	else
	{
		p.validationResults = {};
		p.empty = true;
	}
};

SDL.Client.Exception.ValidationException.prototype.getValidationResults = function SDL$Client$ValidationException$getValidationResults()
{
	var p = this.properties;
	return p.empty ? null : p.validationResults;
};

SDL.Client.Exception.ValidationException.prototype.addValidationResult = function SDL$Client$ValidationException$addValidationResult(property, errorCode, message, description)
{
	var p = this.properties;
	p.empty = false;
	p.validationResults[property] = SDL.Client.Types.OO.implementsInterface(errorCode, "SDL.Client.Exception.Exception")
		? errorCode
		: new SDL.Client.Exception.Exception(errorCode, message, description);
};

SDL.Client.Exception.ValidationException.prototype.removeValidationResult = function SDL$Client$ValidationException$removeValidationResult(property)
{
	var p = this.properties;
	if (!p.empty)
	{
		if (!property)
		{
			p.validationResults = {};
			p.empty = true;
			return true;
		}
		else
		{
			if (p.validationResults[property])
			{
				delete p.validationResults[property];
				p.empty = SDL.jQuery.isEmptyObject(p.validationResults);
				return true;
			}
		}
	}
};

SDL.Client.Exception.ValidationException.prototype.getDescription = function SDL$Client$ValidationException$getDescription()
{
	var p = this.properties;
	return p.empty
		? "There are no validation errors"
		: "The following properties are invalid:" + SDL.jQuery.map(p.validationResults, function(exception, property) { return property; }).join(",");
};