/*! @namespace {SDL.Client.Models.Base.ObjectWithEditor} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.ObjectWithEditor");

SDL.Client.Models.Base.ObjectWithEditor.$constructor = function SDL$Client$Models$Base$ObjectWithEditor$constructor(id)
{
	this.addInterface("SDL.Client.Models.MarshallableObject");
	this.properties.display;
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.openInEditor = function SDL$Client$Models$Base$ObjectWithEditor$openInEditor(url, optWindow, params, features)
{
	var display = this.getEditor();
	var hasPopupBlocker = false;
	if (!display)
	{
		// fix for gecko to be able to open the popup, otherwise firefox won't open it :(
		var prefix = "";
		if (SDL.jQuery.browser.mozilla)
		{
			var loc = window.location;
			prefix = loc.protocol + "//" + loc.hostname + ((loc.port == 80) ? "" : (":" + loc.port));
		}

		this.properties.display = display = optWindow ||
			(
				features
					? window.open(prefix + this.expandEditorUrl(url, params), "", features)
					: window.open(prefix + this.expandEditorUrl(url, params))
			);
		
		if (!display)
		{
			this.fireEvent("editoropenfailed");
		} 
		else
		{
			this.fireEvent("editoropen");
		}
	}
	else if (display != optWindow)
	{
		setTimeout(this.getDelegate(this.forceFocusToEditor), 0);
	}

	if (display)
	{
		display.focus();
	}

	return display;
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.forceFocusToEditor = function SDL$Client$Models$Base$ObjectWithEditor$forceFocusToEditor()
{
	var display = this.getEditor();
	if (display)
	{
		display.alert(this.getMessageAlreadyOpen());
	}
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getMessageItemAlreadyOpen = function SDL$Client$Models$Base$ObjectWithEditor$getMessageItemAlreadyOpen()
{
	return "Item is already open.";
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.closeEditor = function SDL$Client$Models$Base$ObjectWithEditor$closeEditor()
{
	var display = this.getEditor();
	if (display)
	{
		display.close();
	}
	return display;
};

/*
	Item editor implementation should call item.onEditorUnload when the editor window gets closed
*/
SDL.Client.Models.Base.ObjectWithEditor.prototype.onEditorUnload = function SDL$Client$Models$Base$ObjectWithEditor$onEditorUnload()
{
	this.properties.display = undefined;
	this.fireEvent("editorclose");
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getEditor = function SDL$Client$Models$Base$ObjectWithEditor$getEditor()
{
	var display = this.properties.display;
	if (display && !display.closed)
	{
		try
		{
			//if (!!(display.SDL))	// <- commented out because it causes a memory leak in IE
			{
				return display;
			}
		}
		catch (err)
		{
			// the window appears to have been reloaded, can't access
		}
	}
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.expandEditorUrl = function SDL$Client$Models$Base$ObjectWithEditor$expandEditorUrl(url, params)
{
	SDL.Client.Diagnostics.Assert.raiseError("Editor URL is undefined for this item.");
};

SDL.Client.Models.Base.ObjectWithEditor.prototype.getShortcutUrl = function SDL$Client$Models$Base$ObjectWithEditor$getShortcutUrl(url)
{
	SDL.Client.Diagnostics.Assert.raiseError("Shortcut URL is undefined for this item.");
};

// ------- SDL.Client.Models.MarshallableObject implementations/overrides
SDL.Client.Models.Base.ObjectWithEditor.prototype.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ObjectWithEditor$pack()
{
	var display = this.getEditor();
	return !display || ((display == window) && SDL.Client.Event.EventRegister.isUnloading()) ? null : {"display": display};
});

SDL.Client.Models.Base.ObjectWithEditor.prototype.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$ObjectWithEditor$unpack(data)
{
	if (data)
	{
		this.properties.display = data.display;
	}
});

// ------- end of SDL.Client.Models.MarshallableObject overrides
