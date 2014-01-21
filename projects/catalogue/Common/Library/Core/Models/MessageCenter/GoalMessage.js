/*! @namespace {SDL.Client.Models.MessageCenter.GoalMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.GoalMessage");

SDL.Client.Models.MessageCenter.GoalMessage.$constructor = function SDL$Client$Models$MessageCenter$GoalMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.GOAL;

	this.properties.maxAge = 3000;	// archive the message by default in 3 seconds
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.GOAL] = "SDL.Client.Models.MessageCenter.GoalMessage";