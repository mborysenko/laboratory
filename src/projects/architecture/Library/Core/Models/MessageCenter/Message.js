/*! @namespace {SDL.Client.Models.MessageCenter.Message} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.Message");

SDL.Client.Models.MessageCenter.Message.$constructor = function SDL$Client$Models$MessageCenter$Message$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");

	var p = this.properties;

	p.id;
	p.messageType;
	p.title = title;
	p.description = description;
	p.active = true;

	p.actions = [];
	p.options = SDL.Client.Types.Object.clone(options) || {};

	p.date = new Date();
	p.maxAge;	// don't archive the message by default
	p.expireTimeout;
};

SDL.Client.Models.MessageCenter.Message.prototype.$initialize = function SDL$Client$Models$MessageCenter$Message$initialize()
{
	var p = this.properties;

	p.id = SDL.Client.Models.getUniqueId();

	this.populateActions();

	var maxAge = p.maxAge;
	if (SDL.Client.Type.isNumber(maxAge))
	{
		p.expireTimeout = setTimeout(this.getDelegate(this.expire), maxAge > 1000 ? maxAge : 1000);	// keep it active for a minimum of 1 second
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getId = function SDL$Client$Models$MessageCenter$Message$getId()
{
	return this.properties.id;
};

SDL.Client.Models.MessageCenter.Message.prototype.getMessageType = function SDL$Client$Models$MessageCenter$Message$getMessageType()
{
	return this.properties.messageType;
};

SDL.Client.Models.MessageCenter.Message.prototype.getTitle = function SDL$Client$Models$MessageCenter$Message$getTitle()
{
	return this.properties.title;
};

SDL.Client.Models.MessageCenter.Message.prototype.getDescription = function SDL$Client$Models$MessageCenter$Message$getDescription()
{
	return this.properties.description;
};

SDL.Client.Models.MessageCenter.Message.prototype.getCreationDate = function SDL$Client$Models$MessageCenter$Message$getCreationDate()
{
	return this.properties.date;
};

SDL.Client.Models.MessageCenter.Message.prototype.isActive = function SDL$Client$Models$MessageCenter$Message$isActive()
{
	return this.properties.active;
};

SDL.Client.Models.MessageCenter.Message.prototype.getTargetWindow = function SDL$Client$Models$MessageCenter$Message$getTargetWindow()
{
	return this.properties.options.localToWindow;
};

SDL.Client.Models.MessageCenter.Message.prototype.getModalForWindow = function SDL$Client$Models$MessageCenter$Message$getModalForWindow()
{
	return this.properties.options.modalForWindow;
};

SDL.Client.Models.MessageCenter.Message.prototype.expire = function SDL$Client$Models$MessageCenter$Message$expire()
{
	var p = this.properties;
	p.timeoutObj = null;
	SDL.Client.MessageCenter.executeAction(p.id, "archive");
};

SDL.Client.Models.MessageCenter.Message.prototype.archive = function SDL$Client$Models$MessageCenter$Message$archive()
{
	var p = this.properties;
	if (this.isActive())
	{
		p.active = false;
		p.options.targetWindow = undefined;
		if (p.timeoutObj)
		{
			clearTimeout(p.timeoutObj);
			p.timeoutObj = null;
		}
		this.fireEvent("archive");
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getActions = function SDL$Client$Models$MessageCenter$Message$getActions()
{
	return this.properties.actions;
};

SDL.Client.Models.MessageCenter.Message.prototype.addAction = function SDL$Client$Models$MessageCenter$Message$addAction(action, name, options, position)
{
	SDL.Client.Types.Array.insert(this.properties.actions, {
			action: action,
			name: name,
			options: SDL.Client.Types.Object.clone(options)
		}, position);
};

SDL.Client.Models.MessageCenter.Message.prototype.populateActions = function SDL$Client$Models$MessageCenter$Message$populateActions()
{
	// Add needed actions in derived class
};

SDL.Client.Models.MessageCenter.Message.prototype.clearActions = function SDL$Client$Models$MessageCenter$Message$clearActions()
{
	this.properties.actions = [];
};

SDL.Client.Models.MessageCenter.Message.prototype.setOption = function SDL$Client$Models$MessageCenter$Message$setOption(name, value)
{
	if (name && (value == null || SDL.Client.Type.isString(value) || SDL.Client.Type.isNumber(value) || SDL.Client.Type.isBoolean(value)))
	{
		this.properties.options[name] = value;
	}
};

SDL.Client.Models.MessageCenter.Message.prototype.getOption = function SDL$Client$Models$MessageCenter$Message$getOption(name)
{
	return this.properties.options[name];
};

//------- SDL.Client.Models.MarshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.Message.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$pack()
{
	var p = this.properties;
	return {
		id: p.id,
		title: p.title, 
		description: p.description,
		active: p.inactive,
		actions: p.actions,
		maxAge: p.maxAge,
		date: p.date.getTime(),
		options: p.options
	};
});

SDL.Client.Models.MessageCenter.Message.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.id = data.id;
		p.title = data.title;
		p.description = data.description;
		p.active = data.active;
		p.maxAge = data.maxAge;
		p.date = new Date(data.date);
		p.options = SDL.Client.Types.Object.clone(data.options);

		var actions = data.actions;
		for (var i = 0, len = actions.length; i < len; i++)
		{
			var action = actions[i];
			p.actions[i] =
			{
				action: action.action,
				description: action.description,
				options: SDL.Client.Types.Object.clone(data.options)
			};
		}
	}
});

SDL.Client.Models.MessageCenter.Message.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$Message$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.active && SDL.Client.Type.isNumber(p.maxAge))
	{
		var date = new Date();

		p.maxAge = p.maxAge - (date.getTime() - p.date.getTime());
		p.date = date;
		p.expireTimeout = setTimeout(this.getDelegate(this.expire), p.maxAge > 1000 ? p.maxAge : 1000);
	}
});
//------- end of SDL.Client.Models.MarshallableObject overrides