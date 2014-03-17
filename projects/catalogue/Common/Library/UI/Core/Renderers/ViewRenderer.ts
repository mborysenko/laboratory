/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
/// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />

module SDL.UI.Core.Renderers
{
	export interface ITemplateRenderer
	{
		render(templateContent: string, target: HTMLElement, options: any, callback?: ()=>void): void;
	};

	export class ViewRenderer
	{
		/*private*/ static templateRenderers: {[type: string]: ITemplateRenderer; } = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)
		/*private*/ static types: {[index: string]: Function;} = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)
		/*private*/ static createdViews: {[type: string]: any[]; } = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		static registerTemplateRenderer(type:string, renderer: ITemplateRenderer): void
		{
			ViewRenderer.templateRenderers[type] = renderer;
		}

		static getTemplateRenderer(type:string): ITemplateRenderer
		{
			return ViewRenderer.templateRenderers[type];
		}

		static renderView(type: string, element: HTMLElement, settings?: any, callback?: (view: any)=>void, errorcallback?: (error: string)=>void): void
		{
			if (element)
			{
				SDL.jQuery(element).data("view-create", true);
			}

			SDL.Client.Resources.ResourceManager.load(type, () =>
				{
					if (!element || SDL.jQuery(element).data("view-create"))
					{
						var ctor: any = ViewRenderer.types[type];
						if (!ctor)
						{
							ctor = ViewRenderer.types[type] = ViewRenderer.getTypeConstructor(type);
						}

						if (!element)
						{
							if (ctor.createElement)
							{
								element = ctor.createElement(document, settings);
							}
							else
							{
								element = document.createElement("div");
							}
						}

						// Instantiate the view
						var view = new ctor(element, settings);
						if (!SDL.Client.Types.OO.implementsInterface(view, "SDL.UI.Core.Views.ViewBase"))
						{
							SDL.Client.Diagnostics.Assert.raiseError("'" + type + "' must implement SDL.UI.Core.Views.ViewBase interface.");
						}

						// Render the view
						view.render(!callback ? null : () => { callback(view); });
					}
				}, errorcallback);
		}

		static onViewCreated(view: SDL.Client.Types.OO.IInheritable): void
		{
			var type = view.getTypeName();
			if (ViewRenderer.createdViews[type])
			{
				ViewRenderer.createdViews[type].push(view);
			}
			else
			{
				ViewRenderer.createdViews[type] = [view];
			}
		}

		static disposeView(view: any): void
		{
			SDL.jQuery(view.getElement()).removeData();
			view.dispose();
		}

		static onViewDisposed(view: SDL.Client.Types.OO.IInheritable): void
		{
			var type = view.getTypeName();
			if (ViewRenderer.createdViews[type])
			{
				SDL.Client.Types.Array.removeAt(ViewRenderer.createdViews[type], ViewRenderer.createdViews[type].indexOf(view));
			}
		}

		static getCreatedViewCounts(): {[type: string]: number; }
		{
			var createdViews:{[type: string]: number; } = {};
			SDL.jQuery.each(ViewRenderer.createdViews, function(type, views)
				{
					createdViews[type] = views.length;
				});
			return createdViews;
		}

		private static getTypeConstructor(type: string): Function
		{
			SDL.Client.Diagnostics.Assert.isString(type, "View type name is expected.");

			var ctor: Function;
			try
			{
				ctor = SDL.Client.Type.resolveNamespace(type);
			}
			catch (err)
			{
				SDL.Client.Diagnostics.Assert.raiseError("Unable to evaluate \"" + type + "\": " + err.description);
			}
			SDL.Client.Diagnostics.Assert.isFunction(ctor, "Unable to evaluate \"" + type + "\".");
			return ctor;
		}
	};
};