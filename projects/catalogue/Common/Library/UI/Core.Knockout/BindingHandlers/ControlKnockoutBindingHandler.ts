/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.BindingHandlers
{
	export interface IControlKnockoutBinding
	{
		type?: string;
		handler?: string;
		controlsDescendantBindings?: boolean;	// by default it's false
		data?: any;
	}

	class ControlKnockoutBindingHandler implements KnockoutBindingHandler
	{
		init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): {controlsDescendantBindings: boolean;}
		{
			var value = <IControlKnockoutBinding>ko.unwrap(valueAccessor()) || "";
			if (value)
			{
				ko.utils.domNodeDisposal.addDisposeCallback(element, ControlKnockoutBindingHandler.elementDisposalCallback);
				SDL.jQuery(element).data("control-create", true);

				var type = <string>(SDL.Client.Type.isString(value) ? value : (value.type || ""));
				if (type)
				{
					SDL.Client.Resources.ResourceManager.load(type,
						() => { ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext); });
				}
				else
				{
					ControlKnockoutBindingHandler.initControlBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
				return value.controlsDescendantBindings ? {controlsDescendantBindings: true} : undefined;
			}
		}

		update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var value = ko.unwrap(valueAccessor()) || "";
			if (value)
			{
				var $e = SDL.jQuery(element);
				var handler = $e.data("control-handler");

				if (handler !== null)	// null means handler could not be resolved or has no 'update' method
				{
					if (!handler)
					{
						$e.data("control-update", true);
					}
					else if (handler.update)
					{
						handler.update(element, ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
					}
					else
					{
						$e.data("control-handler", null);
					}
				}
			}
		}

		private static initControlBinding(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var $e = SDL.jQuery(element);
			if ($e.data("control-create"))
			{
				var value = <IControlKnockoutBinding>ko.toJS(valueAccessor()) || "";
				var type = value.type || ""+value;
				var handlerName = value.handler;
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

				if (handler)
				{
					var dataValueAccessor = ControlKnockoutBindingHandler.getDataValueAccessor(valueAccessor);
					if (handler.init)
					{
						handler.init(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
					}
					$e.data("control-handler", handler);
					if ($e.data("control-update"))
					{
						$e.data("control-update", null);
						if (handler.update)
						{
							handler.update(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
						}
					}
				}
				else
				{
					$e.data("control-handler", null);
					if (type)
					{
						// no handler is found, just create the control
						SDL.UI.Core.Renderers.ControlRenderer.renderControl(type, element, value.data,
							(control: Core.Controls.IControl) => ControlKnockoutBindingHandler.addControlDisposalCallback(element, control));
					}
				}
			}
		}

		private static getDataValueAccessor(valueAccessor: () => any): () => any
		{
			return ()=>{ return valueAccessor().data; };
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