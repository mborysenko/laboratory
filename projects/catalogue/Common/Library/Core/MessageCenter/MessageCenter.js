/*! @namespace {SDL.Client.MessageCenter} */
SDL.Client.Type.registerNamespace("SDL.Client.MessageCenter");

SDL.Client.MessageCenter.MessageType =
{
	NOTIFICATION: "notification",
	ERROR: "error",
	WARNING: "warning",
	QUESTION: "question",
	PROGRESS: "progress",
	GOAL: "goal"
}
SDL.Client.MessageCenter.MessageTypesRegistry = { };

SDL.Client.MessageCenter.localMessages = [];

SDL.Client.MessageCenter.getInstance = function SDL$Client$MessageCenter$getInstance()
{
	throw Error("SDL.Client.MessageCenter.getInstance() method is not implemented.");
};

SDL.Client.MessageCenter.createMessage = function SDL$Client$MessageCenter$createMessage(messageType, title, description, options)
{
	var msg = this.getInstance().createMessage(messageType, title, description, options);
	if (msg && options && options.localToWindow)
	{
		SDL.Client.MessageCenter.localMessages.push(msg.getId());
	}
	return msg;
};

SDL.Client.MessageCenter.registerMessage = function SDL$Client$MessageCenter$registerMessage(type, title, description, options)
{
	var msg = this.createMessage(type, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerNotification = function SDL$Client$MessageCenter$registerNotification(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.NOTIFICATION, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerError = function SDL$Client$MessageCenter$registerError(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.ERROR, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerException = function SDL$Client$MessageCenter$registerException(exception, options)
{
	this.registerError(exception.getMessage(), exception.getDescription(), options);
};

SDL.Client.MessageCenter.registerWarning = function SDL$Client$MessageCenter$registerWarning(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.WARNING, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerQuestion = function SDL$Client$MessageCenter$registerQuestion(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.QUESTION, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerProgress = function SDL$Client$MessageCenter$registerProgress(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.PROGRESS, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.registerGoal = function SDL$Client$MessageCenter$registerGoal(title, description, options)
{
	var msg = this.createMessage(SDL.Client.MessageCenter.MessageType.GOAL, title, description, options);
	if (msg)
	{
		this.getInstance().registerMessage(msg);
	}
};

SDL.Client.MessageCenter.getMessageByID = function SDL$Client$MessageCenter$getMessageByID(id)
{
	var instance = this.getInstance();
	if (instance)
	{
		return instance.getMessageByID(id);
	}
};

SDL.Client.MessageCenter.getMessages = function SDL$Client$MessageCenter$getMessages()
{
	return this.getInstance().getMessages();
};

SDL.Client.MessageCenter.getActiveMessages = function SDL$Client$MessageCenter$getActiveMessages()
{
	return this.getInstance().getActiveMessages();
};

SDL.Client.MessageCenter.executeAction = function SDL$Client$MessageCenter$executeAction(messageID, action, params)
{
	this.getInstance().executeAction(messageID, action, params);
};

SDL.Client.MessageCenter.addEventListener = function SDL$Client$MessageCenter$addEventListener(event, handler)
{
	SDL.Client.Event.EventRegister.addEventHandler(this.getInstance(), event, handler);
};

SDL.Client.MessageCenter.removeEventListener = function SDL$Client$MessageCenter$removeEventListener(event, handler)
{
	var instance = this.getInstance();
	if (instance)
	{
		SDL.Client.Event.EventRegister.removeEventHandler(instance, event, handler);
	}
};

SDL.Client.MessageCenter.archiveLocalMessages = function SDL$Client$MessageCenter$archiveLocalMessages()
{
	var messages = SDL.Client.MessageCenter.localMessages;
	if (messages.length)
	{
		var instance = SDL.Client.MessageCenter.getInstance();
		for (var i = 0; i < messages.length; i++)
		{
			instance.executeAction("archive", messages[i]);
		}
	}
};
SDL.Client.Event.EventRegister.addEventHandler(window, "unload", SDL.Client.MessageCenter.archiveLocalMessages);
