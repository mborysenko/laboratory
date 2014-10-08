/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />

module SDL.UI.Core.Knockout.Controls
{
	export function createKnockoutBinding(control: SDL.UI.Core.Controls.IControlType, name: string): void
	{
		ko.bindingHandlers[name] = new KnockoutBindingHandler(control, name);
	}

	export class KnockoutBindingHandler
	{
		private control: Core.Controls.IControlType;
		private name: string;
		private static eventHandlersAttributeName = "data-__knockout_binding_events__";
		private koDisposeCallbackHandler: () => void;

		constructor(control: Core.Controls.IControlType, name: string)
		{
			this.control = control;
			this.name = name;

			// knockout calls init and update without KnockoutBindingHandler's context
			this.init = this.init.bind(this);
			this.update = this.update.bind(this);
		}

		public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			// everything is done in update
		}

		public update(element: HTMLElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var values: any = valueAccessor();
			var attrName = Core.Controls.getInstanceAttributeName(this.control);
			var instance: Core.Controls.IControl = (<any>element)[attrName];
			
			var controlEvents: {[event: string]: any;};
			var events = ko.unwrap(allBindings.get("controlEvents"));
			if (events)
			{
				controlEvents = events[this.name];
			}

			if (!instance || ((<SDL.Client.Types.IDisposableObject><any>instance).getDisposed && (<SDL.Client.Types.IDisposableObject><any>instance).getDisposed()))
			{
				if (instance)
				{
					// instance is there -> it's disposed -> release references to event handlers
					(<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName] = null;
				}

				// create a control instance
				(<any>element)[attrName] = instance = new this.control(element, Knockout.Utils.unwrapRecursive(values));
				instance.render();
				this.koDisposeCallbackHandler = this.disposeForElement.bind(this, element);
				ko.utils.domNodeDisposal.addDisposeCallback(element, this.koDisposeCallbackHandler);

				this.addEventHandlers(instance, controlEvents, values, bindingContext['$data']);
			}
			else
			{
				this.removeEventHandlers(instance);
				this.addEventHandlers(instance, controlEvents, values, bindingContext['$data']);

				if (instance.update)
				{
					// Call update on the existing instance
					instance.update(Knockout.Utils.unwrapRecursive(values));
				}
			}
		}

		public disposeForElement(element: HTMLElement)
		{
			var attrName = Core.Controls.getInstanceAttributeName(this.control);
			var instance: Core.Controls.IControl = (<any>element)[attrName];

			if (instance)
			{
				ko.utils.domNodeDisposal.removeDisposeCallback(element, this.koDisposeCallbackHandler);

				if ((<SDL.Client.Types.IDisposableObject><any>instance).getDisposed && !(<SDL.Client.Types.IDisposableObject><any>instance).getDisposed())
				{
					// not disposed yet -> remove handlers and dispose
					this.removeEventHandlers(instance);
					Core.Renderers.ControlRenderer.disposeControl(instance);
				}
				else
				{
					// already disposed -> release references to event handlers
					(<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName] = null;
				}
				(<any>element)[attrName] = null;
			}
		}

		private addEventHandlers(instance: Core.Controls.IControl, controlEvents: {[event: string]: any;}, values: any, viewModel: any)
		{
			if ((<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener)
			{
				var events = (<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName] = <{[event: string]: any;}>{};
				var propertyChangeHandler: (e: any) => void = (values
					? function(e: any)
						{
							var propertyChain = (e.data.property + "").split(".");
							var setting: any = values;
						
							for (var i = 0; setting && i < propertyChain.length; i++)
							{
								setting = ko.unwrap(setting);
								if (setting)
								{
									setting = setting[propertyChain[i]];
								}
							}

							if (ko.isWriteableObservable(setting))
							{
								setting(e.data.value);
							}
							else if (propertyChain.length > 1 && ko.isWriteableObservable(values[e.data.property]))
							{
								values[e.data.property](e.data.value);
							}
						}
					: null);

				if (controlEvents)
				{
					SDL.jQuery.each(controlEvents, (eventName: string, eventHandler: any) =>
						{
							if (SDL.Client.Type.isFunction(eventHandler))
							{
								if (eventName == "propertychange" && propertyChangeHandler)
								{
									(<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener(eventName, events[eventName] = function(e: any)
									{
										propertyChangeHandler(e);
										eventHandler.apply(viewModel, [viewModel, e, instance]);
									});
								}
								else
								{
									(<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener(eventName, events[eventName] = function(e: any)
									{
										eventHandler.apply(viewModel, [viewModel, e, instance]);
									});
								}
							}
						});
				}

				if (propertyChangeHandler && !events["propertychange"])
				{
					(<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener("propertychange", events["propertychange"] = propertyChangeHandler);
				}
			}
		}

		private removeEventHandlers(instance: Core.Controls.IControl)
		{
			if ((<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName])
			{
				SDL.jQuery.each((<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName], (event: string, handler: any) =>
				{
					(<SDL.Client.Types.IObjectWithEvents><any>instance).removeEventListener(event, handler);
				});
				(<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName] = null;
			}
		}
	}
}