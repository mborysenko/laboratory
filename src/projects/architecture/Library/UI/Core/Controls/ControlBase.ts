/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ControlRenderer.ts" />
/// <reference path="Base.ts" />

module SDL.UI.Core.Controls
{
	export interface IControlBase extends IControl, SDL.Client.Types.IObjectWithEvents
	{
		getJQuery?: () => JQueryStatic;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class ControlBase extends SDL.Client.Types.ObjectWithEvents implements IControlBase
	{
		constructor(element: HTMLElement, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void)
		{
			super();
			var p = this.properties;
			p.element = element;
			p.options = options;
			p.jQuery = jQuery;
			p.callback = callback;
			p.errorcallback = errorcallback;
		}

		public update(options?: any): void
		{
			this.properties.options = options;
			// will be overwritten in deriving class
		}

		public $initialize(): void
		{			
			var controlType: IControlType = SDL.Client.Type.resolveNamespace(this.getTypeName());
			this.properties.element[getInstanceAttributeName(controlType)] = this;
			Renderers.ControlRenderer.onControlCreated(this);
			this.render();
		}

		public render(): void
		{
			this.setRendered();
			// override in subclasses
		}

		public setRendered(): void
		{
			var p = this.properties;
			p.errorcallback = null;
			if (p.callback)
			{
				p.callback();
				p.callback = null;
			}
		}

		public getElement(): HTMLElement
		{
			return this.properties.element;
		}

		public getJQuery(): JQueryStatic
		{
			return this.properties.jQuery;
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