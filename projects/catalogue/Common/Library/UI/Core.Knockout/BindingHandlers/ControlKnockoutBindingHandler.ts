/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
/// <reference path="../Controls/Base.ts" />

module SDL.UI.Core.Knockout.BindingHandlers
{
	export interface IEvents
	{
		[event: string]: () => void;
	}

	interface IControlEventsBinding
	{
		controlEvents?: {[control: string]: IEvents};
	}

	export interface IControlKnockoutBindingValue
	{
		type?: string;
		handler?: string;
		controlsDescendantBindings?: boolean;	// by default it's false
		data?: any;
		events?: IEvents;
	}

	class ControlKnockoutBindingHandler implements KnockoutBindingHandler
	{
		init(element: HTMLElement, valueAccessor: () => IControlKnockoutBindingValue, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): {controlsDescendantBindings: boolean;}
		{
			var value: IControlKnockoutBindingValue = ko.unwrap(valueAccessor());
			if (value)
			{
				var handlers = <{[type: string]: KnockoutBindingHandler}>{};
				SDL.jQuery(element).data("control-handlers", handlers);
				ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);

				if (SDL.Client.Type.isArray(value))
				{
					SDL.jQuery.each(<IControlKnockoutBindingValue[]>value, (index: number, value: IControlKnockoutBindingValue) =>
						{
							value = ko.unwrap(value);
							handlers[<string>ko.unwrap(value.type) || ("" + (value || <string>ko.unwrap(value.handler) || ""))] = undefined;
							ControlKnockoutBindingHandler.addControlBinding(element, () => value, allBindingsAccessor, viewModel, bindingContext);
						});
				}
				else
				{
					handlers[<string>ko.unwrap(value.type) || ("" + (value || <string>ko.unwrap(value.handler) || ""))] = undefined;
					ControlKnockoutBindingHandler.addControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
				return value.controlsDescendantBindings ? {controlsDescendantBindings: true} : undefined;
			}
		}

		update(element: HTMLElement, valueAccessor: () => IControlKnockoutBindingValue, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var $e = SDL.jQuery(element);
			var handlers: {[type: string]: KnockoutBindingHandler;} = $e.data("control-handlers");
			var value = <IControlKnockoutBindingValue>ko.unwrap(valueAccessor()) || "";
			var typeValues: {[type: string]: IControlKnockoutBindingValue; };

			if (value)
			{
				typeValues = {};
				if (SDL.Client.Type.isArray(value))
				{
					SDL.jQuery.each(<IControlKnockoutBindingValue[]>(<any>value), (index: number, value: IControlKnockoutBindingValue) =>
						{
							value = <IControlKnockoutBindingValue>ko.unwrap(value);
							typeValues[<string>ko.unwrap(value.type) || ("" + (value || <string>ko.unwrap(value.handler) || ""))] = value;
						});
				}
				else
				{
					typeValues[<string>ko.unwrap(value.type) || ("" + (value || <string>ko.unwrap(value.handler) || ""))] = value;
				}
			}

			if (handlers)
			{
				SDL.jQuery.each(handlers, (type: string, handler: KnockoutBindingHandler) =>
					{
						if (!typeValues || !typeValues[type])
						{
							// control has been removed -> dispose
							delete handlers[type];
							if (handler && (<SDL.UI.Core.Knockout.Controls.KnockoutBindingHandler>handler).disposeForElement)
							{
								(<SDL.UI.Core.Knockout.Controls.KnockoutBindingHandler>handler).disposeForElement(element);
							}
						}
					});
			}

			if (typeValues)
			{
				if (!handlers)
				{
					// controls have been added
					SDL.jQuery(element).data("control-handlers", handlers = <{[type: string]: KnockoutBindingHandler}>{});
					ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);
				}

				SDL.jQuery.each(typeValues, (type: string, value: IControlKnockoutBindingValue) =>
					{
						if (!handlers || handlers[type] === undefined)
						{
							// control has just been added -> create
							handlers[type] = undefined;
							ControlKnockoutBindingHandler.addControlBinding(element, () => value, allBindingsAccessor, viewModel, bindingContext);
						}
						
						ControlKnockoutBindingHandler.updateControlBinding(element, () => value, allBindingsAccessor, viewModel, bindingContext);
					});
			}
			else
			{
				SDL.jQuery(element).removeData("control-handlers");
			}
		}

		private static addControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBindingValue, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var value = <IControlKnockoutBindingValue>ko.unwrap(valueAccessor()) || "";
			if (value)
			{
				var type: string = ko.unwrap(value.type) || ""+value;
				if (type)
				{
					SDL.Client.Resources.ResourceManager.load(type,
						() => { ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext); });
				}
				else
				{
					ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
			}
		}

		private static initControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBindingValue, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var $e = SDL.jQuery(element);
			var handlers: {[type: string]: KnockoutBindingHandler} = $e.data("control-handlers");
			if (handlers)	// will not be there if the element has been disposed
			{
				var value = <IControlKnockoutBindingValue>ko.unwrap(valueAccessor());
				var handlerName = <string>ko.unwrap(value.handler);
				var type = <string>ko.unwrap(value.type) || ("" + (value || handlerName || ""));

				if (type in handlers)
				{
					var handler: KnockoutBindingHandler;

					if (handlerName)
					{
						// if handle name is provided, first try to find a registered ko binding with the name
						handler = <KnockoutBindingHandler>ko.bindingHandlers[handlerName];
						if (!handler)
						{
							// then try to evaluate the handler globally
							try
							{
								handler = SDL.Client.Type.resolveNamespace(handlerName);
							}
							catch (err)
							{
								throw Error("Unable to resolve handler '" + handlerName + "': " + err.message);
							}

							if (!handler)
							{
								throw Error("Unable to resolve handler '" + handlerName + "'.");
							}
						}
					}
					else if (type)
					{
						// otherwise use the type to find the ko binding
						handler = <KnockoutBindingHandler>ko.bindingHandlers[type];

						if (!handler)
						{
							// create a binding handler for the given type
							var control: Core.Controls.IControlType;
							try
							{
								control = SDL.Client.Type.resolveNamespace(type);
							}
							catch (err)
							{
								throw Error("Unable to resolve type '" + type + "': " + err.message);
							}

							if (control && !((<any>control).init || (<any>control).update))	// it doesn't seem to be a ko binding handler -> create a binding handler
							{
								handler = new Controls.KnockoutBindingHandler(control, type);
							}
						}
					}

					handlers[type] = handler || null;
					if (handler)
					{
						var dataValueAccessor = ControlKnockoutBindingHandler.getDataValueAccessor(value);
						var allBindingsWithEventsAccessor = ControlKnockoutBindingHandler.getAllBindingsWithEventsAccessor(allBindingsAccessor, type, value);

						if (handler.init)
						{
							handler.init(element, dataValueAccessor, allBindingsWithEventsAccessor, viewModel, bindingContext);
						}

						if ($e.data("control-update") && handler.update)
						{
							handler.update(element, dataValueAccessor, allBindingsWithEventsAccessor, viewModel, bindingContext);
						}
					}
				}
			}
		}

		private static updateControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBindingValue, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var $e = SDL.jQuery(element);
			var handlers: {[type: string]: KnockoutBindingHandler;} = $e.data("control-handlers");
			if (handlers)
			{
				var value: IControlKnockoutBindingValue = ko.unwrap(valueAccessor());
				if (value)
				{
					var type: string = ko.unwrap(value.type) || ("" + (value || <string>ko.unwrap(value.handler) || ""));
					var handler: KnockoutBindingHandler = handlers[type];

					if (handler !== null)	// === null means handler could not be resolved or has no 'update' method
					{
						if (!handler)
						{
							$e.data("control-update", true);
							Knockout.Utils.unwrapRecursive(value.data);	// this is to make sure observables are evaluated, otherwise ko will not notify us when they change
						}
						else if (handler.update)
						{
							handler.update(element, ControlKnockoutBindingHandler.getDataValueAccessor(value),
								ControlKnockoutBindingHandler.getAllBindingsWithEventsAccessor(allBindingsAccessor, type, value), viewModel, bindingContext);
						}
						else
						{
							handlers[type] = null;
						}
					}
				}
			}
		}

		private static getDataValueAccessor(value: IControlKnockoutBindingValue): () => any
		{
			return ()=>{ return value.data; };
		}

		private static getAllBindingsWithEventsAccessor(allBindingsAccessor: KnockoutAllBindingsAccessor, control: string, value: IControlKnockoutBindingValue): KnockoutAllBindingsAccessor
		{
			if (value.events)
			{
				var allBindings: IControlEventsBinding;
				var controlEvents: {[control: string]: IEvents};

				var allBindingsWithEventsAccessor: KnockoutAllBindingsAccessor = <any>(() =>
				{
					if (!allBindings)
					{
						allBindings = SDL.jQuery.extend({}, allBindingsAccessor());		// cloning not to change the original value
						allBindings.controlEvents = allBindingsWithEventsAccessor.get("controlEvents");
					}
					return allBindings;
				});

				allBindingsWithEventsAccessor.get = (name: string): any =>
				{
					if (name == "controlEvents")
					{
						if (!controlEvents)
						{
							var result = allBindingsAccessor.get(name);
							controlEvents = result
								? SDL.jQuery.extend({}, ko.unwrap(result))		// cloning not to change the original value
								: {};

							if (!controlEvents[control])
							{
								controlEvents[control] = value.events;
							}
							else
							{
								controlEvents[control] = SDL.jQuery.extend(controlEvents[control], value.events);
							}
						}

						return controlEvents;
					}
					else
					{
						return allBindingsAccessor.get(name);
					}
				};

				allBindingsWithEventsAccessor.has = (name: string): boolean =>
				{
					return name == "controlEvents" || allBindingsAccessor.has(name);
				};

				return <KnockoutAllBindingsAccessor>allBindingsWithEventsAccessor;
			}
			else
			{
				return allBindingsAccessor;
			}
		}

		private static elementDisposalCallback(element: HTMLElement): void
		{
			SDL.jQuery(element).removeData();
		}
	};

	(<any>ko.bindingHandlers).control = <KnockoutBindingHandler>(new ControlKnockoutBindingHandler());
};