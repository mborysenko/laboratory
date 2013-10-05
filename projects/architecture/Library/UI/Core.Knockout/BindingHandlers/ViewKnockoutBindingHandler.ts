/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.BindingHandlers
{
	export interface IViewKnockoutBinding
	{
		type?: string;
		handler?: string;
		controlsDescendantBindings?: boolean;	// by default it's true
		data?: any;
	}

	class ViewKnockoutBindingHandler
	{
		init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext): any
		{
			var value = <IViewKnockoutBinding>ko.utils.unwrapObservable(valueAccessor()) || "";
			if (value)
			{
				ko.utils.domNodeDisposal.addDisposeCallback(element, ViewKnockoutBindingHandler.elementDisposalCallback);
				SDL.jQuery(element).data("view-create", true);

				var type = <string>(SDL.Client.Type.isString(value) ? value : (value.type || ""));
				if (type)
				{
					SDL.Client.Resources.ResourceManager.load(type, () => { ViewKnockoutBindingHandler.initViewBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext); });
				}
				else
				{
					ViewKnockoutBindingHandler.initViewBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				}
				return value.controlsDescendantBindings == false ? undefined : {controlsDescendantBindings: true};
			}
			return {controlsDescendantBindings: true};
		}

		update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext): void
		{
			var value = ko.utils.unwrapObservable(valueAccessor()) || "";
			if (value)
			{
				var $e = SDL.jQuery(element);
				var handler = $e.data("view-handler");

				if (handler !== null)	// null means handler could not be resolved or has no 'update' method
				{
					if (!handler)
					{
						$e.data("view-update", true);
					}
					else if (handler.update)
					{
						handler.update(element, ViewKnockoutBindingHandler.getDataValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
					}
					else
					{
						$e.data("view-handler", null);
					}
				}
			}
		}

		private static initViewBinding(element: HTMLElement, valueAccessor: any, allBindingsAccessor, viewModel, bindingContext): void
		{
			var $e = SDL.jQuery(element);
			if ($e.data("view-create"))
			{
				var value = <IViewKnockoutBinding>ko.toJS(valueAccessor()) || "";
				var type = value.type || ""+value;
				var handlerName = value.handler;
				var handler;

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
					var dataValueAccessor = ViewKnockoutBindingHandler.getDataValueAccessor(valueAccessor);
					if (handler.init)
					{
						handler.init(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
					}
					$e.data("view-handler", handler);
					if ($e.data("view-update"))
					{
						$e.data("view-update", null);
						if (handler.update)
						{
							handler.update(element, dataValueAccessor, allBindingsAccessor, viewModel, bindingContext);
						}
					}
				}
				else
				{
					$e.data("view-handler", null);
					if (type)
					{
						// no handler is found, just create the view
						SDL.UI.Core.Renderers.ViewRenderer.renderView(type, element, value.data, ViewKnockoutBindingHandler.addViewDisposalCallback);
					}
				}
			}
		}

		private static getDataValueAccessor(valueAccessor: any)
		{
			return ()=>{ return valueAccessor().data; };
		}

		private static elementDisposalCallback(element)
		{
			SDL.jQuery(element).removeData();
		}

		static addViewDisposalCallback(view)
		{
			ko.utils.domNodeDisposal.addDisposeCallback(view.getElement(), (element) =>
				{
					SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);
				});
		}
	};

	(<any>ko.bindingHandlers).view = <KnockoutBindingHandler>(new ViewKnockoutBindingHandler());
};