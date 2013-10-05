/*! @namespace {SDL.Client.Models.MessageCenter.WarningMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.WarningMessage");

SDL.Client.Models.MessageCenter.WarningMessage.$constructor = function SDL$Client$Models$MessageCenter$WarningMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.WARNING;

	this.properties.maxAge = 10000;	// archive the message by default in 10 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.WARNING] = "SDL.Client.Models.MessageCenter.WarningMessage";