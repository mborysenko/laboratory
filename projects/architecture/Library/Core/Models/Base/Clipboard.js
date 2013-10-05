/*! @namespace {SDL.Client.Models.Base.Clipboard} */
SDL.Client.Types.OO.createInterface("SDL.Client.Models.Base.Clipboard");

/**
 * Implements Clipboard.
 * @constructor
 */
SDL.Client.Models.Base.Clipboard.$constructor = function SDL$Client$Models$Base$Clipboard$constructor()
{
	if (!SDL.Client.Types.OO.implementsInterface(this, "SDL.Client.Models.Base.Clipboard"))
	{
		// called without 'new' keyword
		return SDL.Client.Models.getFromRepository("sdl-base-clipboard") ||
			SDL.Client.Models.createInRepository("sdl-base-clipboard", "SDL.Client.Models.Base.Clipboard");
	}
	else
	{
		// called with 'new' keyword
		this.addInterface("SDL.Client.Models.MarshallableObject");

		var clipboardData; 	// a simple type variable or an array of simple types
		var clipboardAction; // enum SDL.Client.Models.Base.Clipboard.PasteAction
		var itemTypes;

		this.setData = function SDL$Client$Models$Base$Clipboard$setData(data, action)
		{
			if (clipboardAction !== action || clipboardData !== data)
			{
				if (SDL.Client.Type.isArray(data))
				{
					clipboardData = SDL.Client.Types.Array.clone(data);
				}
				else
				{
					clipboardData = data;
				}
				clipboardAction = action;
				itemTypes = undefined;
				this.fireEvent("change");
			}
		};

		this.getData = function SDL$Client$Models$Base$Clipboard$getData()
		{
			return clipboardData;
		};

		this.getAction = function SDL$Client$Models$Base$Clipboard$getAction()
		{
			return clipboardAction;
		};

		this.getDataTypes = function SDL$Client$Models$Base$Clipboard$getDataTypes()
		{
			if (itemTypes === undefined && clipboardData)
			{
				if (SDL.Client.Type.isArray(clipboardData))
				{
					itemTypes = [];
					var itemTypesCache = {};
					for (var i = 0, len = clipboardData.length; i < len; i++)
					{
						var type = SDL.Client.Models.getItemType(clipboardData[i]) || "";

						if (!(type in itemTypesCache))
						{
							itemTypes.push(type);
							itemTypesCache[type] = true;
						}
					}
				}
				else
				{
					return [SDL.Client.Models.getItemType(clipboardData) || ""];
				}
			}
			return itemTypes;
		};

		this.clearData = function SDL$Client$Models$Base$Clipboard$clearData()
		{
			if (clipboardAction !== undefined || clipboardData !== undefined)
			{
				clipboardAction = clipboardData = itemTypes = undefined;
				this.fireEvent("change");
			}
		};

		// implement pack for marshalling
		this.pack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Clipboard$pack()
		{
			return { data: clipboardData, action: clipboardAction };
		});

		// implement unpack for marshalling
		this.unpack = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Models$Base$Clipboard$unpack(data)
		{
			clipboardAction = data.action;

			if (SDL.Client.Type.isArray(data.data))
			{
				clipboardData = SDL.Client.Types.Array.clone(data.data);
			}
			else
			{
				clipboardData = data.data;
			}
		});
	}
};

/**
 * Returns the singleton instance of Clipboard object.
 * @return {SDL.Client.Models.Base.Clipboard} The Clipboard Instance.
 */
SDL.Client.Models.Base.Clipboard.getInstance = function SDL$Client$Models$Base$Clipboard$getInstance()
{
	return SDL.Client.Models.Base.Clipboard();
};

/**
 * Sets the clipboard data title
 * @param {Object} data The clipboard data.
 * @param {String} action The clipboard action.
 */
SDL.Client.Models.Base.Clipboard.setData = function SDL$Client$Models$Base$Clipboard$setData(data, action)
{
	this.getInstance().setData(data, action);
};

/**
 * Gets the clipboard data
 * @returns {Object} data The clipboard data.
 */
SDL.Client.Models.Base.Clipboard.getData = function SDL$Client$Models$Base$Clipboard$getData()
{
	return this.getInstance().getData();
};

/**
 * Gets the array of the clipboard data item types
 * @returns {Array} The array of item types
 */
SDL.Client.Models.Base.Clipboard.getDataTypes = function SDL$Client$Models$Base$Clipboard$getDataTypes()
{
	return this.getInstance().getDataTypes();
};

/**
 * Gets the clipboard stored action
 * @returns {String} The clipboard action.
 */
SDL.Client.Models.Base.Clipboard.getAction = function SDL$Client$Models$Base$Clipboard$getAction()
{
	return this.getInstance().getAction();
};

/**
 * Clears the clipboard data.
 */
SDL.Client.Models.Base.Clipboard.clearData = function SDL$Client$Models$Base$Clipboard$clearData()
{
	this.getInstance().clearData();
};

SDL.Client.Models.Base.Clipboard.PasteAction = {
	COPY: 0,
	CUT: 1
};