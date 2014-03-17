/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.ts" />
/// <reference path="KnockoutBindingHandlers.ts" />

module SDL.UI.Core.Knockout.BindingHandlers
{
	export interface IViewKnockoutBinding
	{
		type?: string;
		handler?: string;
		controlsDescendantBindings?: boolean;	// by default it's true
		data?: any;
	}

	class ViewKnockoutBindingHandler implements KnockoutBindingHandler
	{
		init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): {controlsDescendantBindings: boolean;}
		{
			var value = <IViewKnockoutBinding>ko.unwrap(valueAccessor()) || "";
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

		update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var value = ko.unwrap(valueAccessor()) || "";
			if (value)
			{
				var $e = SDL.jQuery(element);
				var handler = $e.data("view-handler");

				if (handler !== null)	// null means handler could not be resolved or has no 'update' method
				{
					if (!handler)
					{
						$e.data("view-update", true);
						Knockout.Utils.unwrapRecursive(value.data);	// this is to make sure observables are evaluated, otherwise ko will not notify us when they change
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

		private static initViewBinding(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void
		{
			var $e = SDL.jQuery(element);
			if ($e.data("view-create"))
			{
				var value = <IViewKnockoutBinding>ko.unwrap(valueAccessor()) || "";
				var type = <string>ko.unwrap(value.type) || ""+value;
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
						SDL.UI.Core.Renderers.ViewRenderer.renderView(type, element,
							BindingHandlers.areKnockoutObservableSettingsEnabled(type)
								? value.data									// view itself will unwrap KnockoutObservables
								: Knockout.Utils.unwrapRecursive(value.data),	// unwrap observables for the view
							ViewKnockoutBindingHandler.addViewDisposalCallback);
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

		static addViewDisposalCallback(view: Core.Views.ViewBase): void
		{
			ko.utils.domNodeDisposal.addDisposeCallback(view.getElement(), (element: HTMLElement) =>
				{
					SDL.UI.Core.Renderers.ViewRenderer.disposeView(view);
				});
		}
	};

	(<any>ko.bindingHandlers).view = <KnockoutBindingHandler>(new ViewKnockoutBindingHandler());
};