/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />

module SDL.UI.Core.Knockout.Controls
{
	export function createKnockoutBinding(control: SDL.UI.Core.Controls.IControlType,
			name: string, events?: Core.Controls.IPluginEventDefinition[]): void
	{
		ko.bindingHandlers[name] = new KnockoutBindingHandler(control, name, events);
	}

	class KnockoutBindingHandler
	{
		private control: Core.Controls.IControlType;
		private events: Core.Controls.IPluginEventDefinition[];
		private name: string;
		private static eventHandlersAttributeName = "data-__knockout_binding_events__";

		constructor(control: Core.Controls.IControlType, name: string, events: Core.Controls.IPluginEventDefinition[])
		{
			this.control = control;
			this.events = events;
			this.name = name;
		}

		public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			// everything is done in update
		}

		public update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext)
		{
			var values: any = valueAccessor();
			var attrName = Core.Controls.getInstanceAttributeName(this.control);
			var instance: Core.Controls.IControl = (<any>element)[attrName];
			if (!instance || ((<SDL.Client.Types.IDisposableObject><any>instance).getDisposed && (<SDL.Client.Types.IDisposableObject><any>instance).getDisposed()))
			{
				// create a control instance
				(<any>element)[attrName] = instance = new this.control(element, Knockout.Utils.unwrapRecursive(values), ko.unwrap(allBindingsAccessor().jQuery));
				instance.render();
				ko.utils.domNodeDisposal.addDisposeCallback(element,
					() => Core.Renderers.ControlRenderer.disposeControl(instance));

				this.addEventHandlers(instance, values, bindingContext['$data']);
			}
			else
			{
				this.removeEventHandlers(instance);
				this.addEventHandlers(instance, values, bindingContext['$data']);

				if (instance.update)
				{
					// Call update on the existing instance
					instance.update(Knockout.Utils.unwrapRecursive(values));
				}
			}
		}

		private addEventHandlers(instance: Core.Controls.IControl, values: any, viewModel: any)
		{
			if ((<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener)
			{
				var events = (<any>instance)[KnockoutBindingHandler.eventHandlersAttributeName] = <{[event: string]: any;}>{};

				(<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener("propertychange", events["propertychange"] = function(e: any)
					{
						if (values && ko.isWriteableObservable(values[e.data.property]))
						{
							values[e.data.property](e.data.value);
						}
					});

				if (this.events)
				{
					SDL.jQuery.each(this.events, (i: number, event: Core.Controls.IPluginEventDefinition) =>
						{
							if (values && SDL.Client.Type.isFunction(values[event.event]))
							{
								var eventName = event.originalEvent || event.event;
								if (eventName != "propertychange")
								{
									(<SDL.Client.Types.IObjectWithEvents><any>instance).addEventListener(eventName, events[eventName] = function(e: any)
									{
										values[event.event].apply(viewModel, [viewModel, e, instance]);
									});
								}
							}
						});
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