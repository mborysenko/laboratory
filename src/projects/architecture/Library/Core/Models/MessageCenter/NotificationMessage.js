/*! @namespace {SDL.Client.Models.MessageCenter.NotificationMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.NotificationMessage");

SDL.Client.Models.MessageCenter.NotificationMessage.$constructor = function SDL$Client$Models$MessageCenter$NotificationMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.NOTIFICATION;

	this.properties.maxAge = 3000;	// archive the message by default in 3 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.NOTIFICATION] = "SDL.Client.Models.MessageCenter.NotificationMessage";