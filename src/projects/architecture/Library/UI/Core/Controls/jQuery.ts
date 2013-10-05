/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />

module SDL.UI.Core.Controls
{
	export function createJQueryPlugin(jQuery: JQueryStatic, control: IControlType, name: string, methods?: IPluginMethodDefinition[]): void
	{
		jQuery.fn[name] = function SDL$UI$Core$ControlBase$widget(options)
		{
			var instances: IControl[] = [];
			var jQueryObject: JQuery = this;

			jQueryObject.each(function()
			{
				var element = <Element>this;
				var attrName = getInstanceAttributeName(control);
				var instance: IControl = element[attrName];
				if (!instance || (instance.getDisposed && instance.getDisposed()))
				{
					// create a control instance
					instance = element[attrName] = new control(element, options, jQuery);
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
						if (methodDefinition && methodDefinition.method)
						{
							jQueryObject[methodDefinition.method] = function()
								{
									var implementation = methodDefinition.implementation || methodDefinition.method;
									for (var i = 0, len = this.length; i < len; i++)
									{
										var instance: IControlBase = <any>jQueryObject[i];
										var result = instance[implementation].apply(instance, arguments);
										if (methodDefinition.returnsValue)
										{
											return result;
										}
									}
									return jQueryObject;
								};
						}
					});

				jQueryObject["dispose"] = function()
				{
					for (var i = 0, len = this.length; i < len; i++)
					{
						SDL.UI.Core.Renderers.ControlRenderer.disposeControl(<any>jQueryObject[i]);
					}
					return jQueryObject.end();
				};
			}

			return jQueryObject;
		};
	}
}