/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />

module SDL.UI.Core.Controls
{
	export interface JQueryControl extends JQuery
	{
		dispose(): JQuery;
	}

	export function createJQueryPlugin(jQuery: JQueryStatic, control: IControlType, name: string, methods?: IPluginMethodDefinition[]): void
	{
		jQuery.fn[name] = function SDL$UI$Core$ControlBase$widget(options: any)
		{
			var instances: IControl[] = [];
			var jQueryObject: JQuery = this;

			jQueryObject.each(function()
			{
				var element = <Element>this;
				var attrName = getInstanceAttributeName(control);
				var instance: IControl = (<any>element)[attrName];
				if (!instance || ((<SDL.Client.Types.IDisposableObject><any>instance).getDisposed && (<SDL.Client.Types.IDisposableObject><any>instance).getDisposed()))
				{
					// create a control instance
					instance = (<any>element)[attrName] = new control(element, options, jQuery);
					instance.render();
				}
				else if (options && instance.update)
				{
					// Call update on the existing instance
					instance.update(options);
				}
				instances.push(instance);
			});

			jQueryObject = jQueryObject.pushStack(instances);

			if (methods)
			{
				jQuery.each(methods, (i: number, methodDefinition: IPluginMethodDefinition) =>
					{
						if (methodDefinition && methodDefinition.method && methodDefinition.method != "dispose")
						{
							jQueryObject[methodDefinition.method] = function()
								{
									var implementation = methodDefinition.implementation || methodDefinition.method;
									for (var i = 0, len = this.length; i < len; i++)
									{
										var instance: IControlBase = <any>jQueryObject[i];
										var result = (<any>instance)[implementation].apply(instance, arguments);
										if (methodDefinition.returnsValue)
										{
											return result;
										}
									}
									return jQueryObject;
								};
						}
					});
			}

			jQueryObject["dispose"] = function()
			{
				for (var i = 0, len = this.length; i < len; i++)
				{
					SDL.UI.Core.Renderers.ControlRenderer.disposeControl(<any>jQueryObject[i]);
				}
				return jQueryObject.end();
			};

			return jQueryObject;
		};
	}
}