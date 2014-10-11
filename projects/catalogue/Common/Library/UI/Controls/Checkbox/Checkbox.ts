/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />

module SDL.UI.Controls
{
	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class Checkbox extends SDL.UI.Core.Controls.ControlBase
	{
		private _$elem: JQuery;
		private _$img: JQuery;
		private _input: HTMLInputElement;

		$initialize()
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var $elem = this._$elem = SDL.jQuery(this.properties.element);
			var input = this._input = <HTMLInputElement>SDL.jQuery("input[type='checkbox']", $elem).get(0);
			if (input)
			{
				$elem.addClass("sdl-checkbox");
				this._$img = SDL.jQuery("<span class='sdl-checkbox-img'></span>").insertAfter(input);
			}
		}

		public getInputElement(): HTMLInputElement
		{
			return this._input;
		}
	}

	Checkbox.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$Checkbox$disposeInterface()
	{
		SDL.jQuery(this._$elem).removeClass("sdl-checkbox");

		if (this._$img)
		{
			this._$img.remove();
		}

		this._$elem = undefined;
		this._$img = undefined;
		this._input = undefined;
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.Checkbox", Checkbox);
}