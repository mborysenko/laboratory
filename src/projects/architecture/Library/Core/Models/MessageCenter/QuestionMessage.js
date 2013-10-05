/*! @namespace {SDL.Client.Models.MessageCenter.QuestionMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.QuestionMessage");

SDL.Client.Models.MessageCenter.QuestionMessage.$constructor = function SDL$Client$Models$MessageCenter$QuestionMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.QUESTION;
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.populateActions = function SDL$Client$Models$MessageCenter$QuestionMessage$populateActions()
{
	this.callBase("SDL.Client.Models.MessageCenter.Message", "populateActions");
	
	var actionNames = this.properties.options.actionNames || {};

	this.addAction("confirm", actionNames["confirm"] || "Yes");
	this.addAction("cancel", actionNames["cancel"] || "No");
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.confirm = function SDL$Client$Models$MessageCenter$QuestionMessage$confirm()
{
	if (this.isActive())
	{
		this.fireEvent("confirm");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");
	}
};

SDL.Client.Models.MessageCenter.QuestionMessage.prototype.cancel = function SDL$Client$Models$MessageCenter$QuestionMessage$cancel()
{
	if (this.isActive())
	{
		this.fireEvent("cancel");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");
	}
};

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.QUESTION] = "SDL.Client.Models.MessageCenter.QuestionMessage";