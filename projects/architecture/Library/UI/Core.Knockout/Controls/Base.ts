/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

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
			var instance: Core.Controls.IControl = element[attrName];
			if (!instance || instance.getDisposed())
			{
				// create a control instance
				element[attrName] = instance = new this.control(element, ko.toJS(values), ko.utils.unwrapObservable(allBindingsAccessor().jQuery));
				ko.utils.domNodeDisposal.addDisposeCallback(element,
					() => Core.Renderers.ControlRenderer.disposeControl(instance));

				this.addEventHandlers(instance, values);
			}
			else
			{
				this.removeEventHandlers(instance);
				this.addEventHandlers(instance, values);

				if (instance.update)
				{
					// Call update on the existing instance
					instance.update(ko.toJS(values));
				}
			}
		}

		private addEventHandlers(instance: Core.Controls.IControl, values: any)
		{
			var events: {[event: string]: any;} = instance[KnockoutBindingHandler.eventHandlersAttributeName] = {};
			instance.addEventListener("propertychange", events["propertychange"] = function(e)
				{
					if (values && ko.isObservable(values[e.data.property]))
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
								instance.addEventListener(eventName, events[eventName] = function(e)
								{
									values[event.event](e.data);
								});
							}
						}
					});
			}
		}

		private removeEventHandlers(instance: Core.Controls.IControl)
		{
			if (instance[KnockoutBindingHandler.eventHandlersAttributeName])
			{
				SDL.jQuery.each(instance[KnockoutBindingHandler.eventHandlersAttributeName], (event: string, handler: any) =>
				{
					instance.removeEventListener(event, handler);
				});
				instance[KnockoutBindingHandler.eventHandlersAttributeName] = null;
			}
		}
	}
}