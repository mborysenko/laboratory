/*! @namespace {SDL.Client.Event.EventRegisterClass} */
SDL.Client.Types.OO.createInterface("SDL.Client.Event.EventRegisterClass");

SDL.Client.Event.EventRegisterClass.$constructor = function SDL$Client$Event$EventRegisterClass$constructor()
{
	this.addInterface("SDL.Client.Types.ObjectWithEvents");

	var self = this;
	var registryIndex = {};
	var loading = true;
	var unloading = false;

	/**
	* Adds the supplied event handler to the specified element
	* @param {Object} element Either a single HTML element, or an array of HTML elements.
	* @param {String} eventName The name of the event for which to add the binding.
	* @param {Function} eventHandler The function that habdles the event.
	*/
	this.addEventHandler = function SDL$Client$Event$EventRegisterClass$addEventHandler(object, event, handler, useCapture)
	{
		if (registryIndex && !this.getDisposing())
		{
			SDL.Client.Diagnostics.Assert.isObject(object, "SDL.Client.Event.EventRegister.addEventHandler: value should be an object. Provided value is: " + object);
			SDL.Client.Diagnostics.Assert.isString(event);
			SDL.Client.Diagnostics.Assert.isFunction(handler);
			addHandler(object, event, handler, useCapture);
		}
	};

    this.removeEventHandler = function SDL$Client$Event$EventRegisterClass$removeEventHandler(object, event, handler, useCapture)
	{
		if (registryIndex && !this.getDisposing())
		{
			SDL.Client.Diagnostics.Assert.isObject(object, "SDL.Client.Event.EventRegister.removeEventHandler: value should be an object. Provided value is: " + object);
			SDL.Client.Diagnostics.Assert.isString(event);
			removeHandler(object, event, handler, useCapture);
		}
	};

    this.removeAllEventHandlers = function SDL$Client$Event$EventRegisterClass$removeAllEventHandlers(object, event)
	{
		if (registryIndex && object && !this.getDisposing())
		{
			var uniqueId = SDL.Client.Types.Object.getUniqueId(object) || "";
			var registry = registryIndex[uniqueId];
			if (registry)
			{
				var l = registry.length;
				for (var i = 0; i < l; i++)
				{
					if (object == registry[i].object)
					{
						var events = registry[i].events;
						var toUnregister = true;
						if (events)
						{
							for (var e in events)
							{
								if (!event || e == event)
								{
									var listener = events[e];
									if (listener.hasNullHandler)
									{
										toUnregister = false;
										if (listener.handlers.length > 0)
										{
											listener.handlers = [];
										}
									}
									else
									{
										removeListener(object, e, events);
									}
								}
								else
								{
									toUnregister = false;
								}
							}
						}

						if (toUnregister)	// all events have been removed -> unregister
						{
							if (l == 1)
							{
								delete registryIndex[uniqueId];
							}
							else
							{
								SDL.Client.Types.Array.removeAt(registry, i);
							}
						}
						return;
					}
				}
			}
		}
	};

	// returns true while the window is still being loaded
    this.isLoading = function SDL$Client$Event$EventRegisterClass$isLoading()
	{
		return loading;
	};

	// returns true when the window is being unloaded
    this.isUnloading = function SDL$Client$Event$EventRegisterClass$isUnloading()
	{
		return unloading;
	};

	// ------- SDL.Client.Types.DisposableObject methods overrides
    this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Event$EventRegisterClass$disposeInterface()
	{
		if (registryIndex)
		{
			for (var id in registryIndex)
			{
				var registry = registryIndex[id];
				delete registryIndex[id];

				while (registry.length > 0)
				{
					var entry = registry.shift();
					var events = entry.events;
					var object = entry.object;
					if (events)
					{
						for (var e in events)
						{
							removeListener(object, e, events);
						}
					}
				}
			}
			registryIndex = null;
			self = null;
		}
	});

	// Private members

	// get object events from the registry
	function getFromRegistry(object, create)
	{
		if (registryIndex && object)
		{
			var isMarshallable = SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Models.MarshallableObject");
			if (isMarshallable)
			{
				var marshalObject = object.getMarshalObject();
				if (marshalObject)
				{
					object = marshalObject;
				}
			}

			var uniqueId = SDL.Client.Types.Object.getUniqueId(object) || "";
			var registry = registryIndex[uniqueId];
			if (registry)
			{
				for (var i = 0; i < registry.length; i++)
				{
					if (object == registry[i].object)
					{
						return registry[i];
					}
				}
			}
			else if (create)
			{
				registry = registryIndex[uniqueId] = [];
			}

			if (registry)
			{
				var entry = { object: object, events: {} };
				registry.push(entry);

				if (SDL.Client.Types.OO.implementsInterface(object, "SDL.Client.Types.DisposableObject"))
				{
					addHandler(object, "dispose", null); //this is to get notified when the object is being disposed to remove it from the register
					if (isMarshallable)
					{
						addHandler(object, "marshal", null);
					}
				}
				else if (SDL.jQuery.isWindow(object))
				{
					addHandler(object, "unload", null); //this is to get notified when the target window is being unloaded to remove it from the register
				}
				return entry;
			}
		}
	};

	function getObjectEvents(object, create)
	{
		var registryEntry = getFromRegistry(object, create);
		return registryEntry ? registryEntry.events : undefined;
	};

	this._executeListener = function SDL$Client$Event$EventRegisterClass$_executeListener(args, event, registryEntry, listener)
	{
		if (!self.getDisposing())
		{
			var object = registryEntry.object;

			if (event == "dispose" && registryIndex && args[0].target != object)
			{
				// the object might have already been marshalled, ignore the event then
				return;
			}

			if (event == "unload" && object == window)
			{
				unloading = true; // this is a way to indicate that the window is being unloaded
			}

			var handlers = listener.handlers;
			if (handlers && handlers.length)
			{
				if (!args.length)
				{
					args = [window.event];
				}

				var eventObj = args[0] = SDL.jQuery.event.fix(args[0]);

				// handlers can be added/removed while handling an event, thus have to recheck them when at least one handler has been executed
				var needPostprocess;
				var processedHandlers = [];
				var combinedResult;
				var returnFalse = false;

				do
				{
					needPostprocess = false;
					if (handlers)
					{
						for (var i = 0; handlers && (i < handlers.length); i++)
						{
							var handler = handlers[i];
							if (SDL.jQuery.inArray(handler, processedHandlers) == -1)
							{
								needPostprocess = true;
								processedHandlers.push(handler);
								
								var result = handler.fnc.apply(object, args);

								combinedResult = combinedResult || result;
								if (result === false)
								{
									returnFalse = true;
									eventObj.preventDefault();
									eventObj.stopPropagation();
									needPostprocess = false;
									break;
								}
								//while event handling the handlers object may get removed (when detaching the last handler) -> need to reset the local variable
								handlers = listener.handlers;
							}
						}
					}
				}
				while (needPostprocess);
			}

			switch (event)
			{
				case "marshal":
					if (registryIndex && args[0].target == registryEntry.object)	// the object might have already been marshalled, so have to check that
					{
						var uniqueId = SDL.Client.Types.Object.getUniqueId(registryEntry.object) || "";
						var registry = registryIndex[uniqueId];
						if (registry)
						{
							if (registry.length > 1)
							{
								SDL.Client.Types.Array.removeAt(registry, SDL.jQuery.inArray(registryEntry, registry));
							}
							else if (registry.length == 0 || registry[0] == registryEntry)
							{
								delete registryIndex[uniqueId];
							}
						}

						var marshalTarget = registryEntry.object = registryEntry.object.getMarshalObject();

						uniqueId = SDL.Client.Types.Object.getUniqueId(marshalTarget) || "";
						registry = registryIndex[uniqueId];
						if (!registry)
						{
							registryIndex[uniqueId] = [registryEntry];
						}
						else
						{
							registry.push(registryEntry);
						}
					}
					break;
				case "dispose":
					if (registryIndex && args[0].target == registryEntry.object)	// the object might have already been marshalled, so have to check that
					{
						this.removeAllEventHandlers(registryEntry.object);
					}
					break;
				case "load":
					if (registryEntry.object == window)
					{
						loading = false; // done loading
						removeListener(window, "load", registryEntry.events);
					}
					break;
				case "DOMContentLoaded":
					if (registryEntry.object == document)
					{
						loading = false; // done loading
						removeListener(document, "DOMContentLoaded", registryEntry.events);
					}
					break;
				case "unload":
					if (registryEntry.object == window)
					{
						self.dispose();
					}
					else if (SDL.jQuery.isWindow(registryEntry.object))
					{
						this.removeAllEventHandlers(registryEntry.object);
					}
					break;
			}
			if (returnFalse)
			{
				return false;
			}
			else
			{
				return combinedResult;
			}
		}
	};
	
	//add an event handler
	function addHandler(object, event, handler, useCapture)
	{
		var registryEntry = getFromRegistry(object, true);
		var events = registryEntry.events;
		var listener = events[event];
		if (!listener)
		{
			listener = events[event] = self._generateListener(event, registryEntry);
			addListener(object, event, listener, useCapture);
		}
		if (handler)
		{
			listener.handlers.push({fnc:handler});
		}
		else
		{
			listener.hasNullHandler = true;
		}
	};

	//remove an event handler
	function removeHandler(object, event, handler)
	{
		var events = getObjectEvents(object);
		if (events)
		{
			var listener = events[event];
			if (listener)
			{
				var handlers = listener.handlers;
				for (var i = 0; i < handlers.length; i++)
				{
					if (handlers[i].fnc == handler)
					{
						if (handlers.length == 1 && !listener.hasNullHandler)	//last handler -> remove event listener
						{
							removeListener(object, event, events);
						}
						else
						{
							SDL.Client.Types.Array.removeAt(handlers, i);
						}
						return;
					}
				}
			}
		}
	};

	// add an event listener, that will dispatch all the handlers for the event
	function addListener(object, event, listener, useCapture)
	{
		var result = false;
		if (object)
		{
			if (object.attachEvent)
			{
				result = object.attachEvent("on" + event, listener)
			}
			else if (object.addEventListener)
			{
				result = object.addEventListener(event, listener, useCapture || false);
			}
		}
		return result;
	};

	//remove an event listeners
	function removeListener(object, event, events, useCapture)
	{
		var result = false;
		if (object && events)
		{
			var listener = events[event];
			try
			{
				if (object.detachEvent)
				{
					result = object.detachEvent("on" + event, listener)
				}
				else if (object.removeEventListener)
				{
					result = object.removeEventListener(event, listener, useCapture || false);
				}
			}
			catch (ex)
			{ }
			finally
			{
				delete listener["handlers"];
				delete events[event];
			}
		}
		return result;
	};

	addHandler(document, "DOMContentLoaded", null); 	//listen to document.onDOMContentLoaded if supported to detect when the document is loaded; OR ->
	addHandler(window, "load", null); 	//listen to window.onload to detect when the window is loaded, if document.onDOMContentLoaded is not supported
	addHandler(window, "unload", null); 	//listen to window.onunload to dispose the object before destruction
};

SDL.Client.Event.EventRegisterClass.prototype._generateListener = function SDL$Client$Event$EventRegisterClass$_generateListener(event, registryEntry)
{
	var self = this;
	var listener = function()
	{
		return self._executeListener(SDL.Client.Types.Array.fromArguments(arguments), event, registryEntry, listener);
	}
	listener.handlers = [];
	return listener;
};

SDL.Client.Event.EventRegister = new SDL.Client.Event.EventRegisterClass();