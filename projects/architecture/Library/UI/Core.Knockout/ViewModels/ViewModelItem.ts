/// <reference path="..\..\SDL.Client.Core\Types\Types.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Models\Models.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Types\DisposableObject.d.ts" />
/// <reference path="..\..\SDL.Client.Core\Event\EventRegister.d.ts" />
/// <reference path="..\Libraries\knockout\knockout.d.ts" />

module SDL.UI.Core.Knockout.ViewModels
{
	/*
		A view-model 'wrapper' for a domain model item
	*/

	export interface IPropertyDef
	{
		getter?: string;
		setter?: string;
		events?: string[];
	};

	export interface IMethodDef
	{
		method?: any;
		args?: any[];
	};

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ViewModelItem extends SDL.Client.Types.DisposableObject
	{
		constructor(item: Object, properties: {[property: string]: IPropertyDef;}, methods: {[method: string]: IMethodDef;});
		constructor(item: string, properties: {[property: string]: IPropertyDef;}, methods: {[method: string]: IMethodDef;});
		constructor(item: any, properties: {[property: string]: IPropertyDef;}, methods: {[method: string]: IMethodDef;})
		{
			super();

			var p = this.properties;

			p.item = SDL.Client.Type.isString(item) ? SDL.Client.Models.getItem(item) : item;
			p.properties = properties || {};	// i.e. {title: {getter: "getTitle", setter: "setTitle", events: ["load", "change"]}, content: {events: ["load", "change"]}}
			p.methods = methods || {};			// i.e. {load: {method: "load"}, reload: {method: "load", args: [true]}}
			p.observables = {};
		}

		public $initialize(): void
		{
			var p = this.properties;

			this._createProperties();
			this._createMethods();
			SDL.Client.Event.EventRegister.addEventHandler(p.item, "*", this.getDelegate(this._onEvent));
		}

		private _createProperties(): void
		{
			var p = this.properties;
			if (p.properties)
			{
				for (var property in p.properties)
				{
					var propOptions = <IPropertyDef>(p.properties[property] || {});

					var getter = propOptions.getter;
					if (getter)
					{
						this._checkMethod(getter);
					}

					var setter = propOptions.setter;
					if (setter)
					{
						this._checkMethod(setter);
					}

					if (!setter || !getter)	// no getter or no setter is defined -> determine it from the property name
					{
						var upProperty = property.charAt(0).toUpperCase() + property.slice(1);
						if (!getter)
						{
							getter = "get" + upProperty;
							if (!p.item[getter])
							{
								getter = "is" + upProperty;
							}

							if (!p.item[getter])
							{
								SDL.Client.Diagnostics.Assert.raiseError("Unable to determine a getter for property '" + property + "' of item " +
									(p.item.getId ? ("'" + p.item.getId() + "'") : (p.item.getTypeName ? p.item.getTypeName() : "")) + ".");
							}
						}

						if (!setter)
						{
							var s = "set" + upProperty;
							if (p.item[s])
							{
								setter = s;
							}
						}
					}

					this._createEventObservables(propOptions.events);

					var options:any = { read: this._createPropertyReader(propOptions.events, getter) };
					if (setter)
					{
						options.write = this._createPropertyWriter(setter);
					}

					this[property] = ko.computed(options);
				}
			}
		}

		private _createPropertyReader(events: string[], getter: string): ()=>any
		{
			var p = this.properties;
			return function()
				{
					if (events)
					{
						for (var i = 0, len = events.length; i < len; i++)
						{
							p.observables[events[i]]();	// access an observable, to get this reader triggered when that observable changes
						}
					}
					return p.item[getter]();
				};
		}

		private _createPropertyWriter(setter: string): (value: any)=>void
		{
			var p = this.properties;
			return function(value)
				{
					p.item[setter](value);
				};
		}

		private _createEventObservables(events: string[]): void
		{
			if (events)
			{
				var observables = this.properties.observables;
				for (var i = 0, len = events.length; i < len; i++)
				{
					var event = events[i];
					if (!observables[event])
					{
						observables[event] = ko.observable(0);
					}
				}
			}
		}

		private _createMethods(): void
		{
			var methods = this.properties.methods;
			if (methods)
			{
				for (var method in methods)
				{
					this[method] = this._createMethod(method, methods[method]);
				}
			}
		}

		private _createMethod(methodName: string, methodEntry: IMethodDef): (...args: any[])=>void
		{
			var p = this.properties;
			var method = methodEntry.method || methodName;
			if (SDL.Client.Type.isFunction(method))
			{
				if (methodEntry.args)
				{
					return function () { method.apply(this, methodEntry.args); }
				}
				else
				{
					return method;
				}
			}
			else
			{
				this._checkMethod(method);

				return function()
					{
						return p.item[method].apply(p.item, methodEntry.args || arguments);
					};
			}
		}

		private _checkMethod(methodName: string)
		{
			var item = this.properties.item;
			if (!item[methodName])
			{
				SDL.Client.Diagnostics.Assert.raiseError("Method '" + methodName + "' is not defined on item " +
						(item.getId ? ("'" + item.getId() + "'") : (item.getTypeName ? item.getTypeName() : "")) + ".");
			}
		}

		private _onEvent(evt: JQueryEventObject)
		{
			var p = this.properties;

			var event = evt.type;

			if (event == "marshal")
			{
				p.item = (<SDL.Client.Models.MarshallableObject>(<any>evt.target)).getMarshalObject();
			}

			if (event in p.observables)
			{
				p.observables[event](p.observables[event]() + 1);	// trigger a change in ko.observable, for dependent properties to get an update
			}
		}
	}

	ViewModelItem.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$ViewModels$Knockout$ViewModelItem$disposeInterface()
	{
		var p = this.properties;
		SDL.Client.Event.EventRegister.removeEventHandler(p.item, "*", this.getDelegate(this._onEvent));
		p.item = null;

		for (var property in p.properties)
		{
			this[property].dispose();
			this[property] = null;
		}

		for (var event in p.observables)
		{
			p.observables[event] = null;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Knockout.ViewModels.ViewModelItem", ViewModelItem);
}