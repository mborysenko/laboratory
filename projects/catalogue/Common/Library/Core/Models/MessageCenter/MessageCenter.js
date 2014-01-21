/*! @namespace {SDL.Client.Models.MessageCenter.MessageCenter} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.MessageCenter");

SDL.Client.Models.MessageCenter.MessageCenter.$constructor = function SDL$Client$Models$SDL$Client$Models$MessageCenter$MessageCenter$MessageCenter$constructor()
{
	this.addInterface("SDL.Client.Models.MarshallableObject");
	var p = this.properties;
	p.messages = {};
};

SDL.Client.Models.MessageCenter.MessageCenter.$execute = function SDL$Client$Models$SDL$Client$Models$MessageCenter$MessageCenter$MessageCenter$execute()
{
	return SDL.Client.Models.getFromRepository("sdl-message-center") ||
			SDL.Client.Models.createInRepository("sdl-message-center", "SDL.Client.Models.MessageCenter.MessageCenter");
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.createMessage = function SDL$Client$Models$MessageCenter$MessageCenter$createMessage(messageType, title, description, options)
{
	var implementation = SDL.Client.MessageCenter.MessageTypesRegistry[messageType];
	if (SDL.Client.Type.isString(implementation))
	{
		var resolved = SDL.Client.Type.resolveNamespace(implementation);
		var msg = new (resolved)(title, description, options);
		return msg;
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.registerMessage = function SDL$Client$Models$MessageCenter$MessageCenter$registerMessage(msg)
{
	if (msg && SDL.Client.Types.OO.implementsInterface(msg, "SDL.Client.Models.MessageCenter.Message"))
	{
		this.properties.messages[msg.getId()] = msg;
		this.fireEvent("newmessage", { messageID: msg.getId() });
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getMessages = function SDL$Client$Models$MessageCenter$MessageCenter$getMessages()
{
	return this.properties.messages;
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getActiveMessages = function SDL$Client$Models$MessageCenter$MessageCenter$getActiveMessages()
{
	var messages = this.properties.messages;
	var result = [];
	for (var i in messages)
	{
		var msg = messages[i];
		if (msg.isActive())
		{
			result.push(msg);
		}
	}
	return result;
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.getMessageByID = function SDL$Client$Models$MessageCenter$MessageCenter$getMessageByID(id)
{
	if (SDL.Client.Type.isString(id))
	{
		return this.properties.messages[id];
	}
};

SDL.Client.Models.MessageCenter.MessageCenter.prototype.executeAction = function SDL$Client$Models$MessageCenter$MessageCenter$executeAction(messageID, action, params)
{
	var msg = this.getMessageByID(messageID);
	if (msg)
	{
		if (SDL.Client.Type.isFunction(msg[action]))
		{
			msg[action](params);
		}
		this.fireEvent(action, { messageID: messageID });
	}
};

// ------- marshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.MessageCenter.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$MessageCenter$pack()
{
	var p = this.properties;
	return {
			messages: p.messages
		};
});

SDL.Client.Models.MessageCenter.MessageCenter.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$MessageCenter$unpack(data)
{
	if (data && data.messages)
	{
		var msgs = data.messages;
		var p = this.properties;
		for (var id in msgs)
		{
			if (SDL.Client.Types.OO.implementsInterface(msgs[id], "SDL.Client.Models.MarshallableObject"))
			{
				p.messages[id] = SDL.Client.Types.OO.importObject(msgs[id]);
			}
		}
	}
});
// ------- end of SDL.Client.Models.MarshallableObject overrides

SDL.Client.MessageCenter.getInstance = function SDL$Client$Models$MessageCenter$MessageCenter$getInstance()
{
	return SDL.Client.Models.MessageCenter.MessageCenter();
};