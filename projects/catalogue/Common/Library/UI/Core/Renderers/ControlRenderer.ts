/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
/// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
/// <reference path="../Controls/ControlBase.ts" />

module SDL.UI.Core.Renderers
{
	export class ControlRenderer
	{
		/*private*/ static types: {[index: string]: Controls.IControlType;} = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)
		/*private*/ static createdControls: {[type: string]: Controls.IControl[]; } = {};	// commenting 'private' otherwise TypeScript definition file is missing type definition (ts 1.0rc)

		static renderControl(type: string, element: HTMLElement, settings: any,
				callback?: (control: Controls.IControl) => void, errorcallback?: (error: string) => void): void
		{
			if (element)
			{
				SDL.jQuery(element).data("control-create", true);
			}

			SDL.Client.Resources.ResourceManager.load(type, () =>
				{
					if (!element || SDL.jQuery(element).data("control-create"))
					{
						var ctor: Controls.IControlType = ControlRenderer.types[type];
						if (!ctor)
						{
							ctor = ControlRenderer.types[type] = ControlRenderer.getTypeConstructor(type);
						}

						if (!element)
						{
							if (ctor.createElement)
							{
								element = ctor.createElement(document, settings, SDL.jQuery);
							}
							else
							{
								element = document.createElement("div");
							}
						}

						// Instantiate the control
						var control: Controls.IControl = new ctor(element, settings, SDL.jQuery);

						// Render control
						control.render(callback ? () => {
								callback(control);
							}: null, errorcallback);
					}
				});
		}
		
		static onControlCreated(control: Controls.IControlBase): void
		{
			var type = control.getTypeName();
			if (ControlRenderer.createdControls[type])
			{
				ControlRenderer.createdControls[type].push(control);
			}
			else
			{
				ControlRenderer.createdControls[type] = [control];
			}
		}

		static disposeControl(control: Controls.IControl)
		{
			if (control.getElement)
			{
				SDL.jQuery(control.getElement()).removeData();
			}
			if ((<SDL.Client.Types.IDisposableObject><any>control).dispose)
			{
				(<SDL.Client.Types.IDisposableObject><any>control).dispose();
			}
		}

		static onControlDisposed(control: Controls.IControlBase): void
		{
			var type = control.getTypeName();
			if (ControlRenderer.createdControls[type])
			{
				SDL.Client.Types.Array.removeAt(ControlRenderer.createdControls[type], ControlRenderer.createdControls[type].indexOf(control));
			}
		}

		static getCreatedControlCounts(): {[type: string]: number; }
		{
			var createdControls:{[type: string]: number; } = {};
			SDL.jQuery.each(ControlRenderer.createdControls, function(type, controls)
				{
					createdControls[type] = controls.length;
				});
			return createdControls;
		}

		private static getTypeConstructor(type: string): Controls.IControlType
		{
			SDL.Client.Diagnostics.Assert.isString(type, "Control type name is expected.");

			var ctor: Controls.IControlType;
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