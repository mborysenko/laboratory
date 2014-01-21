/*! @namespace {SDL.Client.Models.MessageCenter.ErrorMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.ErrorMessage");

SDL.Client.Models.MessageCenter.ErrorMessage.$constructor = function SDL$Client$Models$MessageCenter$ErrorMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.ERROR;

	this.properties.maxAge = 60000;	// archive the message by default in 1 minute
};

SDL.Client.Models.MessageCenter.ErrorMessage.prototype.getDetails = function SDL$Client$Models$MessageCenter$ErrorMessage$getDetails()
{
	return this.properties.options.details;
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.ERROR] = "SDL.Client.Models.MessageCenter.ErrorMessage";