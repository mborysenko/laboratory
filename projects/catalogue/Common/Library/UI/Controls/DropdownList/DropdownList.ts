/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />

module SDL.UI.Controls
{
	export interface IDropdownListOption
	{
		value: string;
		text?: string;
	}

	export interface IDropdownListOptions
	{
		options: IDropdownListOption[];
		disabled?: boolean;
		selectedValue?: string;
	}

	export interface IDropdownListProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: IDropdownListOptions;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class DropdownList extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: IDropdownListProperties;

		private _$elem: JQuery;
		private _$list: JQuery;
		private _$title: JQuery;
		private _initialTabIndex: string;
		private _tabIndex: string;
		private _height: number;
		private _listHeight: number;
		private _windowHeight: number;

		$initialize()
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $elem = this._$elem = SDL.jQuery(p.element);
			this._$title = SDL.jQuery("<span>").appendTo($elem);
			this._$list = SDL.jQuery("<ul>").appendTo($elem);
			this._initialTabIndex = $elem.attr("tabIndex");
			this._tabIndex = this._initialTabIndex || "0";

			var opts = p.options = SDL.jQuery.extend({}, p.options);
			opts.disabled = opts.disabled != null ? opts.disabled.toString() == "true" : this.isDisabled();
			opts.options = opts.options != null ? SDL.Client.Types.Array.clone(opts.options) : [];

			$elem.addClass("sdl-dropdownlist")
				.on("click", this.getDelegate(this._onClick))
				.on("blur", this.getDelegate(this._onBlur))
				.on("keydown", this.getDelegate(this._onKeyDown));

			this._$list.on("click", this.getDelegate(this._onListClick));
			var $window = SDL.jQuery(window)
				.on("scroll", this.getDelegate(this._hideOptions))
				.on("resize", this.getDelegate(this._onWindowResize));

			this._updateDisabledState();
			this._initializeOptions(opts.options);
			this._updateSelectedValue();

			this._height = $elem.outerHeight();
			this._listHeight = this._$list.outerHeight();
			this._windowHeight = $window.innerHeight();
		}

		public update(options?: IDropdownListOptions): void
		{
			if (options)
			{
				var prevOptions: IDropdownListOptions = SDL.jQuery.extend({}, this.properties.options);
				var changedProperties: string[] = [];

				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

				if (options.disabled != null)
				{
					options.disabled = options.disabled.toString() == "true";
					if (prevOptions.disabled != options.disabled)
					{
						this._updateDisabledState();
						if (options.disabled)
						{
							this._hideOptions();
						}
						changedProperties.push("disabled");
					}					
				}

				var isSelectedValueChanged = options.selectedValue != null && prevOptions.selectedValue != options.selectedValue;
				if (options.options != null)
				{
					this._$list.empty();
					this._initializeOptions(options.options);
					this._updateSelectedValue();
					this._listHeight = this._$list.outerHeight();

					changedProperties.push("options");
					if (isSelectedValueChanged)
					{
						changedProperties.push("selectedValue");
					}
				}
				else if (isSelectedValueChanged)
				{
					var $selectedOption = this._getSelectedOption();
					if ($selectedOption)
					{
						$selectedOption.removeClass("selected");
					}
					this._updateSelectedValue();
					changedProperties.push("selectedValue");
				}

				for (var i = 0, len = changedProperties.length; i < len; i++)
				{
					this.fireEvent("propertychange", { property: changedProperties[i], value: (<any>options)[changedProperties[i]] });
				}
			}
		}

		public disable(): void
		{
			if (!this.isDisabled())
			{
				this.properties.options.disabled = true;
				this._updateDisabledState();
				this._hideOptions();
				this.fireEvent("propertychange", { property: "disabled", value: true });
			}
		}

		public enable(): void
		{
			if (this.isDisabled())
			{
				this.properties.options.disabled = false;
				this._updateDisabledState();
				this.fireEvent("propertychange", { property: "disabled", value: false });
			}
		}

		public isDisabled(): boolean
		{
			return !!this._$elem.attr("disabled");
		}

		public getValue(): string
		{
			return this.properties.options.selectedValue;
		}

		public setValue(value: string): void
		{
			var o = this.properties.options.options;
			var index = -1;
			for (var i = 0, l = o.length; i < l; i++)
			{
				if (o[i].value == value)
				{
					index = i;
					break;
				}
			}

			if (index != -1)
			{
				this._setSelectedOption(this._$list.children().eq(index));
			}
		}

		private _initializeOptions(options: IDropdownListOption[]): void
		{
			var selectedValue = this.properties.options.selectedValue;
			options.forEach((value: IDropdownListOption, index: number) =>
			{
				var text = value.text != null ? value.text : value.value;
				var $elem = SDL.jQuery("<li>")
								.text(text)
								.attr("title", text)
								.appendTo(this._$list);

				if ((index == 0 && selectedValue == null) || selectedValue == value.value)
				{
					var $selectedOption = this._getSelectedOption();
					if ($selectedOption)
					{
						$selectedOption.removeClass("selected");
					}
					$elem.addClass("selected");
				}
			});
		}

		private _updateDisabledState()
		{
			if (this.properties.options.disabled)
			{
				this._$elem.attr("disabled", "true").removeAttr("tabIndex");
			}
			else
			{
				this._$elem.removeAttr("disabled").attr("tabIndex", this._tabIndex);
			}
		}

		private _onWindowResize(): void
		{
			this._windowHeight = SDL.jQuery(window).innerHeight();
			this._hideOptions();
		}

		private _hideOptions(): void
		{
			this._$elem.removeClass("open");
		}

		private _showOptions(): void
		{
			if (!this._isOpen())
			{
				this._$elem.addClass("open");

				var pos = this._$elem.offset();
				var scrollTop = SDL.jQuery(window).scrollTop();
				var top = this._height;
				var offset = 2;

				if (pos.top + this._height + this._listHeight - scrollTop > this._windowHeight)
				{
					top = pos.top - scrollTop > this._listHeight + offset ? -(this._listHeight + offset) : -pos.top + scrollTop;
				}
				this._$list.css("top", top);
			}
		}

		private _toggleOptions(): void
		{
			if (this._isOpen())
			{
				this._hideOptions();
			}
			else
			{
				this._showOptions();
			}
		}

		private _isOpen(): boolean
		{
			return this._$elem.hasClass("open");
		}

		private _onClick(): void
		{
			if (!this.isDisabled())
			{
				this._toggleOptions();
			}
		}

		private _onBlur(): void
		{
			if (this._isOpen())
			{
				this._hideOptions();
			}
		}

		private _getSelectedOption(): JQuery
		{
			return this._$list.find("li.selected");
		}

		private _updateSelectedValue(): void
		{
			var option = this.properties.options.options[this._getSelectedOption().index()];
			var text = option.text || option.value;
			this._$title.text(text).attr("title", text);
		}

		private _setSelectedOption($option: JQuery): void
		{
			if ($option.length > 0)
			{
				var $selectedOption = this._getSelectedOption();
				if ($selectedOption)
				{
					$selectedOption.removeClass("selected");
				}

				$option.addClass("selected");

				var o = this.properties.options;
				var value = o.options[$option.index()].value;

				o.selectedValue = value;
				this._updateSelectedValue();

				this.fireEvent("propertychange", { property: "selectedValue", value: value });
				this.fireEvent("select", { value: value });
			}
		}

		private _onListClick(e: JQueryEventObject): void
		{
			var $target = SDL.jQuery(e.target);
			if ($target.prop("tagName") == "LI" && !$target.hasClass("selected"))
			{
				this._setSelectedOption($target);
			}
			this._hideOptions();
			e.stopPropagation();
		}

		private _selectNext(): void
		{
			this._setSelectedOption(this._getSelectedOption().next());
		}

		private _selectPrevious(): void
		{
			this._setSelectedOption(this._getSelectedOption().prev());
		}

		private _onKeyDown(e: JQueryEventObject)
		{
			switch (e.which)
			{
				case Core.Event.Constants.Keys.ENTER:
					this._toggleOptions();
					break;
				case Core.Event.Constants.Keys.SPACE:
					if (!this._isOpen())
					{
						this._showOptions();
					}
					break;
				case Core.Event.Constants.Keys.ESCAPE:
					if (this._isOpen())
					{
						this._hideOptions();
					}
					break;
				case Core.Event.Constants.Keys.UP:
					this._selectPrevious();
					e.preventDefault();
					break;
				case Core.Event.Constants.Keys.LEFT:
					if (!this._isOpen())
					{
						this._selectPrevious();
					}
					break;
				case Core.Event.Constants.Keys.DOWN:
					this._selectNext();
					e.preventDefault();
					break;
				case Core.Event.Constants.Keys.RIGHT:
					if (!this._isOpen())
					{
						this._selectNext();
					}
					break;
			}
		}
	}

	DropdownList.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$DropdownList$disposeInterface()
	{
		this._$list.off("click", this.getDelegate(this._onListClick));
		SDL.jQuery(window)
			.off("scroll", this.getDelegate(this._hideOptions))
			.off("resize", this.getDelegate(this._onWindowResize));

		this._$title = undefined;
		this._$list = undefined;

		this._$elem.removeClass("sdl-dropdownlist open")
			.off("click", this.getDelegate(this._onClick))
			.off("blur", this.getDelegate(this._onBlur))
			.off("keydown", this.getDelegate(this._onKeyDown))
			.empty();

		if (!this._initialTabIndex)
		{
			this._$elem.removeAttr("tabIndex");
		}
		else
		{
			this._$elem.attr("tabIndex", this._initialTabIndex);
		}

		this._$elem = undefined;
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.DropdownList", DropdownList);
}