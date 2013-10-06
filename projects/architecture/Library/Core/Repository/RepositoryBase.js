/*! @namespace {SDL.Client.Repository.RepositoryBase} */
SDL.Client.Types.OO.createInterface("SDL.Client.Repository.RepositoryBase");

SDL.Client.Repository.ModelRepositoryDiscoveryMode = {
	NONE: 0,
	TOP: 1,
	OPENER: 2,
	FULL: 3
};

SDL.Client.Repository.RepositoryBase.$constructor = function SDL$Client$Repository$RepositoryBase$constructor(mode, identifier)
{
	this.addInterface("SDL.Client.Models.IdentifiableObject", [identifier]);

	var items = {};
	var uniqueId = 0;

	// ------- SDL.Client.Models.MarshallableObject methods implementations/overrides
	this.pack = SDL.Client.Types.OO.nonInheritable(function()
	{
		var data = { "items": items, "uniqueId": uniqueId };
		return data;
	});

	this.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Repository$RepositoryBase$unpack(data)
	{
		if (data)
		{
			uniqueId = data.uniqueId || 0;
			if (data.items)
			{
				for (var id in data.items)
				{
					var item = SDL.Client.Types.OO.importObject(data.items[id]);
					if (item)
					{
						items[id] = item;
					}
				}
			}
		}
	});
	// ------- end of SDL.Client.Models.MarshallableObject overrides

	// ------- SDL.Client.Types.DisposableObject methods overrides
	this.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Repository$RepositoryBase$disposeInterface()
	{
		if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
		{
			window.name = undefined;
			if (window.top != window)
			{
				try
				{
					window.top.name = undefined;
				}
				catch (err)
				{
					//it might fail if the page is loaded in a frame
				}
			}
		}
		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.Event.EventRegister, "beforedispose", this.getDelegate(this._onWindowUnload));
	});
	// ------- end of SDL.Client.Types.DisposableObject overrides

	this.getOwningWindow = function SDL$Client$Repository$RepositoryBase$getOwningWindow()
	{
		return window;
	};

	this.getUniqueId = function SDL$Client$Repository$RepositoryBase$getUniqueId()
	{
		return "id_" + (++uniqueId);
	};

	this.getItem = function SDL$Client$Repository$RepositoryBase$getItem(id)
	{
		return items[id];
	};

	this.setItem = function SDL$Client$Repository$RepositoryBase$setItem(id, item)
	{
		items[id] = item;
	};

	this.removeItem = function SDL$Client$Repository$RepositoryBase$removeItem(id)
	{
		delete items[id];
	};

	this.createItem = function SDL$Client$Repository$RepositoryBase$createItem(id, type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)
	{
		// Unfortunatelly, apply(object, arguments) cannot by used with constructors
		var resolveNamespace = SDL.Client.Type.resolveNamespace(type);
		if (resolveNamespace)
		{
			var item = (items[id] = new (resolveNamespace)(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10));
			if (item)
			{
				return item;
			}
		}
		return null;
	};

	this.getItems = function SDL$Client$Repository$RepositoryBase$getItems()
	{
		return items;
	};

	this._onWindowUnload = function SDL$Client$Repository$RepositoryBase$_onWindowUnload()
	{
		this.dispose();
	};

	//-- start of initialization --
	if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
	{
		// set window name to be able to connect to it using window.open
		window.name = identifier;
		if (window.top != window)
		{
			try
			{
				window.top.name = identifier;
			}
			catch (err)
			{
				//it might fail if the page is loaded in a frame
			}
		}
	}

	SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", this.getDelegate(this._onWindowUnload));	// making sure the repository is disposed last
	//-- end of initialization --
};

// SDL.Client.Repository.RepositoryBase static members
SDL.Client.Repository.RepositoryBase.findRepository = function SDL$Client$Repository$RepositoryBase$findRepository(mode, identifier)
{
	var checkedTopWindows = [];

	var findRepositoryInFrame = function SDL$Client$Repository$RepositoryBase$findRepositoryInFrame(win)
	{
		var repository;

		try
		{
			if (win.SDL && win.SDL.Client)
			{
				repository = win.SDL.Client.ModelRepository;
				if (repository && (repository.getId() != identifier  || repository.getDisposing() || repository.getDisposed()))
				{
					repository = null;
				}
			}
		}
		catch (err)
		{
			// might fail due to different domain
			repository = null;
		}

        if (!repository)
		{
			for (var i = 0, len = win.frames.length; !repository && i < len; i++)
			{
			    if (win.frames[i])
                {
				    repository = findRepositoryInFrame(win.frames[i]);                    
                }
			}
		}
		return repository;
	};

	var findRepositoryInWindow = function SDL$Client$Repository$RepositoryBase$findRepositoryInWindow(win, noOpener)
	{
		if (mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.TOP)
		{
			var top = win ? win.top : window.top;
			if (SDL.jQuery.inArray(top, checkedTopWindows) == -1)
			{
				var repository = findRepositoryInFrame(top);

				if (!noOpener && !repository && mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.OPENER)
				{
					checkedTopWindows.push(top);

					var opener;
					try
					{
						opener = top.opener;
					}
					catch(err)
					{
						opener = null;
					}

					if (opener)
					{
						repository = findRepositoryInWindow(opener);
					}
				}
				return repository;
			}
		}
	};

	var repository = findRepositoryInWindow();

	if (!repository && mode >= SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL)
	{
		var win = window.open("", identifier, "top=10000,left=10000,width=100,height=100");

		if (win && !win.closed && SDL.jQuery.inArray(win, checkedTopWindows) == -1)
		{
			var toClose;
			try
			{
				toClose = (win.location.href == "about:blank");
			}
			catch (err)
			{
				toClose = false;
			}

			if (!toClose)
			{
				var winOpener;
				try
				{
					winOpener = win.opener;
				}
				catch(err)
				{
					winOpener = null;
				}

				try
				{
					toClose = (winOpener == window && win.document && win.document.body && win.document.body.innerHTML.length == 0);
				}
				catch (err)
				{
					toClose = true;
				}
			}

			if (toClose)
			{
				try
				{
					win.close();
				}
				catch (err)
				{ }
			}
			else
			{
				repository = findRepositoryInWindow(win);

				if (!repository)
				{
					try
					{
						win.name = undefined; //clear the name of that window, apparently something has gone wrong there during unload
					}
					catch (err)
					{ }
				}
			}
		}
		
		if (!repository)
		{
			// multiple iframes, if loading simultaneously, might not have discovered each other, then all would try window.open(),
			// then would create their own repositories. Trying to prevent this by inspecting the local window again
			checkedTopWindows = [];
			repository = findRepositoryInWindow(window.top, true);
		}
	}

	return repository;
};

SDL.Client.Repository.RepositoryBase.initRepository = function SDL$Client$Repository$RepositoryBase$initRepository(mode, identifier)
{
	mode = (!isNaN(mode) && (mode || mode === SDL.Client.Repository.ModelRepositoryDiscoveryMode.NONE))
		? Number(mode)
		: SDL.Client.Repository.ModelRepositoryDiscoveryMode.FULL;

	identifier = ("sdl_repository_" + document.location.protocol + document.location.host + "_" + document.location.port + "_" + (identifier || "")).replace(/[\:\/\\\.\-]/g, "_");

	function connectToRepository()
	{
		var modelRepository = SDL.Client.Repository.RepositoryBase.findRepository(mode, identifier);
		if (modelRepository)
		{
			SDL.Client.Event.EventRegister.addEventHandler(modelRepository, "beforedispose", onRepositoryDispose);
			SDL.Client.Event.EventRegister.addEventHandler(modelRepository, "marshal", onRepositoryMarshal);
		}
		return modelRepository;
	};

	function onRepositoryDispose()
	{
		var win = window;
		var evt;
		
		do
		{
			try
			{
				evt = win.SDL &&  win.SDL.Client &&  win.SDL.Client.Event &&  win.SDL.Client.Event.EventRegister;
			}
			catch (err)
			{
				// would fail if cross-domain
			}

			if (evt && evt.isUnloading())
			{
				//if window is being closed -> ignore the event, can't do much anyway
				return;
			}

			try
			{
				win = (win.parent != win) ? win.parent : null;
			}
			catch (err)
			{
				win = null;
				// would fail if an iframe in a document from another domain
			}
		}
		while (win);

		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.ModelRepository, "beforedispose", onRepositoryDispose);
		SDL.Client.Event.EventRegister.removeEventHandler(SDL.Client.ModelRepository, "marshal", onRepositoryMarshal);
		
		SDL.Client.ModelRepository = SDL.Client.Types.OO.importObject(SDL.Client.ModelRepository);
	};

	function onRepositoryMarshal()
	{
		var marshalRepository = SDL.Client.ModelRepository.getMarshalObject();
		if (marshalRepository && !marshalRepository.getDisposing())
		{
			SDL.Client.ModelRepository = marshalRepository;
		}
	};

	SDL.Client.ModelRepository = connectToRepository() || new SDL.Client.Repository.RepositoryBase(mode, identifier);
};