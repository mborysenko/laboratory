/*! @namespace {SDL.Client.Models.MessageCenter.ProgressMessage} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.MessageCenter.ProgressMessage");

SDL.Client.Models.MessageCenter.ProgressMessage.$constructor = function SDL$Client$Models$MessageCenter$ProgressMessage$constructor(title, description, options)
{
	this.addInterface("SDL.Client.Models.MessageCenter.Message", [title, description, options]);
	this.properties.messageType = SDL.Client.MessageCenter.MessageType.PROGRESS;

	var p = this.properties;
	p.operationStopped;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.setTitle = function SDL$Client$Models$MessageCenter$ProgressMessage$setTitle(title)
{
	var p = this.properties;
	if (title != p.title)
	{
		this.properties.title = title;
		this.fireEvent("updatetitle", { title: title });
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.populateActions = function SDL$Client$Models$MessageCenter$ProgressMessage$populateActions()
{
	this.callBase("SDL.Client.Models.MessageCenter.Message", "populateActions");
	
	var options = this.properties.options;
	if (options.canCancel)
	{
		var actionNames = options.actionNames || {};
		this.addAction("cancel", actionNames["cancel"] || "Cancel");
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.setContinuousIterationObject = function SDL$Client$Models$MessageCenter$ProgressMessage$setContinuousIterationObject(id)
{
    var $evt = SDL.Client.Event.EventRegister;
	var item = SDL.Client.Models.getItem(id);
	if (item && SDL.Client.Types.OO.implementsInterface(item, "SDL.Client.Models.Base.ContinuousIterationObject"))
	{
		this.properties.options.continuousObjectId = id;

		$evt.addEventHandler(item, "update", this.getDelegate(this._onUpdate));
		$evt.addEventHandler(item, "error", this.getDelegate(this._onError));
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.collectCounts = function SDL$Client$Models$MessageCenter$ProgressMessage$collectCounts(item)
{
	var options = this.properties.options;
	if (options.continuousObjectId)
	{
		item = item || SDL.Client.Models.getItem(id);
		options.itemsCount = item.getItemsCount() || 0;
		options.itemsDoneCount = item.getItemsDoneCount() || 0;
		options.itemsFailedCount = item.getErrorsCount() || 0;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItems = function SDL$Client$Models$MessageCenter$ProgressMessage$getItems()
{
	return this.properties.options.items;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsCount()
{
	var options = this.properties.options;
	if (options.itemsCount != null)
	{
		return options.itemsCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsCount;
	}
	else if (options.items)
	{
		return options.items.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsDone = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsDone()
{
	return this.properties.options.itemsDone;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsDoneCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsDoneCount()
{
	var options = this.properties.options;
	if (options.itemsDoneCount != null)
	{
		return options.itemsDoneCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsDoneCount;
	}
	else if (options.itemsDone)
	{
		return options.itemsDone.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsFailed = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsFailed()
{
	return this.properties.options.itemsFailed;
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.getItemsFailedCount = function SDL$Client$Models$MessageCenter$ProgressMessage$getItemsFailedCount()
{
	var options = this.properties.options;
	if (options.itemsFailedCount != null)
	{
		return options.itemsFailedCount;
	}
	else if (options.continuousObjectId)
	{
		this.collectCounts();
		return options.itemsFailedCount;
	}
	else if (options.itemsFailed)
	{
		return options.itemsFailed.length;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.archive = function SDL$Client$Models$MessageCenter$ProgressMessage$archive()
{
    var $evt = SDL.Client.Event.EventRegister;
	this.callBase("SDL.Client.Models.MessageCenter.Message", "archive");

	var id = this.properties.options.continuousObjectId;
	if (id)
	{
		var obj = SDL.Client.Models.getItem(id);
		if (obj)
		{
			$evt.removeEventHandler(obj, "update", this.getDelegate(this._onUpdate));
			$evt.removeEventHandler(obj, "error", this.getDelegate(this._onError));
		}
		delete p.processObjectId;
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.finish = function SDL$Client$Models$MessageCenter$ProgressMessage$finish(error)
{
	if (this.isActive())
	{
		this.fireEvent(success ? "success" : "fail");
		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");

		if (!error)
		{
			var options = this.properties.options;
			SDL.Client.MessageCenter.registerGoal(options.successMessageName || "", options.successMessageDescription || "",
				{
					localToWindow: options.localToWindow,
					actionNames: options.successActionNames
				});
		}
		else
		{
			// error is passed
		}
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.cancel = function SDL$Client$Models$MessageCenter$ProgressMessage$cancel()
{
	var p = this.properties;
	var options = p.options;
	if (options.canCancel && this.isActive())
	{
		options.canCancel = false;

		if (!p.operationStopped)
		{
			this.fireEvent("cancel");
			if (options.continuousObjectId)
			{
				var item = SDL.Client.Models.getItem(options.continuousObjectId);
				if (item && item.isActive())
				{
					item.stop();
					p.operationStopped = true;
					return;
				}
			}
		}

		this.canceled();
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.canceled = function SDL$Client$Models$MessageCenter$ProgressMessage$canceled()
{
	if (this.isActive())
	{
		var p = this.properties;
		if (!p.operationStopped)
		{
			this.fireEvent("cancel");
		}

		SDL.Client.MessageCenter.executeAction(this.getId(), "archive");

		var options = p.options;

		SDL.Client.MessageCenter.registerGoal(options.cancelMessageName || "", options.cancelMessageDescription || "",
			{
				localToWindow: options.localToWindow,
				actionNames: options.cancelActionNames
			});
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype._onUpdate = function SDL$Client$Models$MessageCenter$ProgressMessage$_onUpdate(event)
{
	var item = event.target;
	if (item)
	{
		var options = this.properties.options;
		options.itemsCount = options.itemsDoneCount = options.itemsFailedCount = null;

		if (item.isActive())
		{
			this.fireEvent("update");
		}
		else
		{
			this.collectCounts(item);
			if (options.itemsDoneCount != options.itemsCount)
			{
				this.canceled();
			}
			else
			{
				SDL.Client.MessageCenter.executeAction(this.getId(), "finish", item.getErrorDetails());
			}
		}
	}
};

SDL.Client.Models.MessageCenter.ProgressMessage.prototype._onError = function ProgressMessage$_onError(event)
{
	SDL.Client.MessageCenter.executeAction(this.getId(), "finish", event.data.error);
};

//------- SDL.Client.Models.MarshallableObject methods implementations/overrides
SDL.Client.Models.MessageCenter.ProgressMessage.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$pack()
{
	var p = this.properties;
	return {
		operationStopped: p.operationStopped
	};
});

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$unpack(data)
{
	var p = this.properties;
	if (data)
	{
		p.operationStopped = data.operationStopped;
	}
});

SDL.Client.Models.MessageCenter.ProgressMessage.prototype.afterInitializeMarshalledObject = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$MessageCenter$ProgressMessage$afterInitializeMarshalledObject(object)
{
	var p = this.properties;
	if (p.options)
	{
		p.options.item = SDL.Client.Types.Object.clone(p.options.item);
		p.options.itemsDone = SDL.Client.Types.Object.clone(p.options.itemsDone);
		p.options.itemsFailed = SDL.Client.Types.Object.clone(p.options.itemsFailed);
		p.options.actionNames = SDL.Client.Types.Object.clone(p.options.actionNames);
		p.options.successActionNames = SDL.Client.Types.Object.clone(p.options.successActionNames);
		p.options.cancelActionNames = SDL.Client.Types.Object.clone(p.options.cancelActionNames);
	}
});
//------- end of SDL.Client.Models.MarshallableObject overrides

SDL.Client.MessageCenter.MessageTypesRegistry[SDL.Client.MessageCenter.MessageType.PROGRESS] = "SDL.Client.Models.MessageCenter.ProgressMessage";