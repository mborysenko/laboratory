/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />

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

	export interface IControlKnockoutBinding
	{
		type?: string;
		handler?: string;
		controlsDescendantBindings?: boolean;	// by default it's false
		data?: any;
		events?: IEvents;
	}

	class ControlKnockoutBindingHandler implements KnockoutBindingHandler
	{
		init(element: HTMLElement, valueAccessor: () => IControlKnockoutBinding, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): {controlsDescendantBindings: boolean;}
		{
			var value: IControlKnockoutBinding = ko.unwrap(valueAccessor());
			if (value)
			{
				SDL.jQuery(element).data("control-handlers", {});
				ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);

				if (SDL.Client.Type.isArray(value))
				{
					SDL.jQuery.each(<IControlKnockoutBinding[]>value, (index: number, value: IControlKnockoutBinding) =>
						{
							ControlKnockoutBindingHandler.addControlBinding(element, () => value, allBindingsAccessor, viewModel, bindingContext);
						});
				}
				else
				{
					ControlKnockoutBindingHandler.addControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
				return value.controlsDescendantBindings ? {controlsDescendantBindings: true} : undefined;
			}
		}

		update(element: HTMLElement, valueAccessor: () => IControlKnockoutBinding, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			// TODO: implement dynamically adding/removing controls:
			//		- if controls are added -> they must be loaded and initialized
			//		- if controls are removed -> they must be disposed

			var value = <IControlKnockoutBinding>ko.unwrap(valueAccessor()) || "";
			if (value)
			{
				if (SDL.Client.Type.isArray(value))
				{
					SDL.jQuery.each(<IControlKnockoutBinding[]>value, (index: number, value: IControlKnockoutBinding) =>
						{
							ControlKnockoutBindingHandler.updateControlBinding(element, () => value, allBindingsAccessor, viewModel, bindingContext);
						});
				}
				else
				{
					ControlKnockoutBindingHandler.updateControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
			}
		}

		private static addControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBinding, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var value = <IControlKnockoutBinding>ko.unwrap(valueAccessor()) || "";
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

		private static initControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBinding, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var $e = SDL.jQuery(element);
			var handlers: {[type: string]: KnockoutBindingHandler;} = $e.data("control-handlers");
			if (handlers)	// will not be there if the element is disposed
			{
				var value = <IControlKnockoutBinding>ko.unwrap(valueAccessor());
				var type = <string>ko.unwrap(value.type) || ""+(value || "");
				var handlerName = <string>ko.unwrap(value.handler);
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
				else
				{
					// otherwise use the type to find the ko binding
					handler = <KnockoutBindingHandler>ko.bindingHandlers[type];
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
				else if (type)
				{
					// no handler is found, just create the control
					SDL.UI.Core.Renderers.ControlRenderer.renderControl(type, element, Knockout.Utils.unwrapRecursive(value.data),
						(control: Core.Controls.IControl) => ControlKnockoutBindingHandler.addControlDisposalCallback(element, control));
				}
			}
		}

		private static updateControlBinding(element: HTMLElement, valueAccessor: () => IControlKnockoutBinding, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var $e = SDL.jQuery(element);
			var handlers: {[type: string]: KnockoutBindingHandler;} = $e.data("control-handlers");
			if (handlers)
			{
				var value: IControlKnockoutBinding = ko.unwrap(valueAccessor());
				if (value)
				{
					var type: string = ko.unwrap(value.type) || ""+(value || "");
					var handler: KnockoutBindingHandler = handlers[type];

					if (handler !== null)	// null means handler could not be resolved or has no 'update' method
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
							$e.data("control-handlers")[type] = null;
						}
					}
				}
			}
		}

		private static getDataValueAccessor(value: IControlKnockoutBinding): () => any
		{
			return ()=>{ return value.data; };
		}

		private static getAllBindingsWithEventsAccessor(allBindingsAccessor: () => IControlEventsBinding, control: string, value: IControlKnockoutBinding): () => any
		{
			if (value.events)
			{
				var allBindings: IControlEventsBinding;

				return () =>
				{
					if (!allBindings)
					{
						allBindings = SDL.jQuery.extend({}, allBindingsAccessor());
						if (!allBindings.controlEvents)
						{
							allBindings.controlEvents = {};
						}
						else
						{
							allBindings.controlEvents = SDL.jQuery.extend({}, ko.unwrap(allBindings.controlEvents));
						}

						if (!allBindings.controlEvents[control])
						{
							allBindings.controlEvents[control] = value.events;
						}
						else
						{
							allBindings.controlEvents[control] = SDL.jQuery.extend(allBindings.controlEvents[control], value.events);
						}
					}
					return allBindings;
				};
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

		static addControlDisposalCallback(element: HTMLElement, control: Core.Controls.IControl): void
		{
			ko.utils.domNodeDisposal.addDisposeCallback(element, (element: HTMLElement) =>
				{
					SDL.UI.Core.Renderers.ControlRenderer.disposeControl(control);
				});
		}
	};

	(<any>ko.bindingHandlers).control = <KnockoutBindingHandler>(new ControlKnockoutBindingHandler());
};