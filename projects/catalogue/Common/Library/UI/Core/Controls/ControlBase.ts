/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />

module SDL.UI.Core.Controls
{
	export interface IControlBase extends IControl, SDL.Client.Types.IObjectWithEvents
	{
	}

	export interface IControlBaseProperties extends SDL.Client.Types.IObjectWithEventsProperties
	{
		element: HTMLElement;
		options?: any;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ControlBase extends SDL.Client.Types.ObjectWithEvents implements IControlBase
	{
		public properties: IControlBaseProperties;
		constructor(element: HTMLElement, options?: any)
		{
			super();
			var p = this.properties;
			p.element = element;
			p.options = options;
		}

		public update(options?: any): void
		{
			this.properties.options = options;
			// will be overwritten in deriving class
		}

		public $initialize(): void
		{			
			var controlType: IControlType = SDL.Client.Type.resolveNamespace(this.getTypeName());
			(<any>this.properties.element)[getInstanceAttributeName(controlType)] = this;
			Renderers.ControlRenderer.onControlCreated(this);
		}

		public render(callback?: () => void, errorcallback?: (error: string) => void): void
		{
			this.setRendered(callback);
			// override in subclasses
		}

		public setRendered(callback?: () => void): void
		{
			if (callback)
			{
				callback();
			}
		}

		public getElement(): HTMLElement
		{
			return this.properties.element;
		}

		public dispose(): void
		{
			this.callBase("SDL.Client.Types.ObjectWithEvents", "dispose");
			Renderers.ControlRenderer.onControlDisposed(this);
		}
	}

	ControlBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$Controls$ControlBase$disposeInterface()
	{

	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Core.Controls.ControlBase", ControlBase);
}