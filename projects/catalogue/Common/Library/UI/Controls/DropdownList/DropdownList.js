/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Controls) {
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var DropdownList = (function (_super) {
                __extends(DropdownList, _super);
                function DropdownList() {
                    _super.apply(this, arguments);
                }
                DropdownList.prototype.$initialize = function () {
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

                    $elem.addClass("sdl-dropdownlist").on("click", this.getDelegate(this._onClick)).on("blur", this.getDelegate(this._onBlur)).on("keydown", this.getDelegate(this._onKeyDown));

                    this._$list.on("click", this.getDelegate(this._onListClick));
                    var $window = SDL.jQuery(window).on("scroll", this.getDelegate(this._hideOptions)).on("resize", this.getDelegate(this._onWindowResize));

                    this._updateDisabledState();
                    this._initializeOptions(opts.options);
                    this._updateSelectedValue();

                    this._height = $elem.outerHeight();
                    this._listHeight = this._$list.outerHeight();
                    this._windowHeight = $window.innerHeight();
                };

                DropdownList.prototype.update = function (options) {
                    if (options) {
                        var prevOptions = SDL.jQuery.extend({}, this.properties.options);
                        var changedProperties = [];

                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        if (options.disabled != null) {
                            options.disabled = options.disabled.toString() == "true";
                            if (prevOptions.disabled != options.disabled) {
                                this._updateDisabledState();
                                if (options.disabled) {
                                    this._hideOptions();
                                }
                                changedProperties.push("disabled");
                            }
                        }

                        var isSelectedValueChanged = options.selectedValue != null && prevOptions.selectedValue != options.selectedValue;
                        if (options.options != null) {
                            this._$list.empty();
                            this._initializeOptions(options.options);
                            this._updateSelectedValue();
                            this._listHeight = this._$list.outerHeight();

                            changedProperties.push("options");
                            if (isSelectedValueChanged) {
                                changedProperties.push("selectedValue");
                            }
                        } else if (isSelectedValueChanged) {
                            var $selectedOption = this._getSelectedOption();
                            if ($selectedOption) {
                                $selectedOption.removeClass("selected");
                            }
                            this._updateSelectedValue();
                            changedProperties.push("selectedValue");
                        }

                        for (var i = 0, len = changedProperties.length; i < len; i++) {
                            this.fireEvent("propertychange", { property: changedProperties[i], value: options[changedProperties[i]] });
                        }
                    }
                };

                DropdownList.prototype.disable = function () {
                    if (!this.isDisabled()) {
                        this.properties.options.disabled = true;
                        this._updateDisabledState();
                        this._hideOptions();
                        this.fireEvent("propertychange", { property: "disabled", value: true });
                    }
                };

                DropdownList.prototype.enable = function () {
                    if (this.isDisabled()) {
                        this.properties.options.disabled = false;
                        this._updateDisabledState();
                        this.fireEvent("propertychange", { property: "disabled", value: false });
                    }
                };

                DropdownList.prototype.isDisabled = function () {
                    return !!this._$elem.attr("disabled");
                };

                DropdownList.prototype.getValue = function () {
                    return this.properties.options.selectedValue;
                };

                DropdownList.prototype.setValue = function (value) {
                    var o = this.properties.options.options;
                    var index = -1;
                    for (var i = 0, l = o.length; i < l; i++) {
                        if (o[i].value == value) {
                            index = i;
                            break;
                        }
                    }

                    if (index != -1) {
                        this._setSelectedOption(this._$list.children().eq(index));
                    }
                };

                DropdownList.prototype._initializeOptions = function (options) {
                    var _this = this;
                    var selectedValue = this.properties.options.selectedValue;
                    options.forEach(function (value, index) {
                        var text = value.text != null ? value.text : value.value;
                        var $elem = SDL.jQuery("<li>").text(text).attr("title", text).appendTo(_this._$list);

                        if ((index == 0 && selectedValue == null) || selectedValue == value.value) {
                            var $selectedOption = _this._getSelectedOption();
                            if ($selectedOption) {
                                $selectedOption.removeClass("selected");
                            }
                            $elem.addClass("selected");
                        }
                    });
                };

                DropdownList.prototype._updateDisabledState = function () {
                    if (this.properties.options.disabled) {
                        this._$elem.attr("disabled", "true").removeAttr("tabIndex");
                    } else {
                        this._$elem.removeAttr("disabled").attr("tabIndex", this._tabIndex);
                    }
                };

                DropdownList.prototype._onWindowResize = function () {
                    this._windowHeight = SDL.jQuery(window).innerHeight();
                    this._hideOptions();
                };

                DropdownList.prototype._hideOptions = function () {
                    this._$elem.removeClass("open");
                };

                DropdownList.prototype._showOptions = function () {
                    if (!this._isOpen()) {
                        this._$elem.addClass("open");

                        var pos = this._$elem.offset();
                        var scrollTop = SDL.jQuery(window).scrollTop();
                        var top = this._height;
                        var offset = 2;

                        if (pos.top + this._height + this._listHeight - scrollTop > this._windowHeight) {
                            top = pos.top - scrollTop > this._listHeight + offset ? -(this._listHeight + offset) : -pos.top + scrollTop;
                        }
                        this._$list.css("top", top);
                    }
                };

                DropdownList.prototype._toggleOptions = function () {
                    if (this._isOpen()) {
                        this._hideOptions();
                    } else {
                        this._showOptions();
                    }
                };

                DropdownList.prototype._isOpen = function () {
                    return this._$elem.hasClass("open");
                };

                DropdownList.prototype._onClick = function () {
                    if (!this.isDisabled()) {
                        this._toggleOptions();
                    }
                };

                DropdownList.prototype._onBlur = function () {
                    if (this._isOpen()) {
                        this._hideOptions();
                    }
                };

                DropdownList.prototype._getSelectedOption = function () {
                    return this._$list.find("li.selected");
                };

                DropdownList.prototype._updateSelectedValue = function () {
                    var option = this.properties.options.options[this._getSelectedOption().index()];
                    var text = option.text || option.value;
                    this._$title.text(text).attr("title", text);
                };

                DropdownList.prototype._setSelectedOption = function ($option) {
                    if ($option.length > 0) {
                        var $selectedOption = this._getSelectedOption();
                        if ($selectedOption) {
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
                };

                DropdownList.prototype._onListClick = function (e) {
                    var $target = SDL.jQuery(e.target);
                    if ($target.prop("tagName") == "LI" && !$target.hasClass("selected")) {
                        this._setSelectedOption($target);
                    }
                    this._hideOptions();
                    e.stopPropagation();
                };

                DropdownList.prototype._selectNext = function () {
                    this._setSelectedOption(this._getSelectedOption().next());
                };

                DropdownList.prototype._selectPrevious = function () {
                    this._setSelectedOption(this._getSelectedOption().prev());
                };

                DropdownList.prototype._onKeyDown = function (e) {
                    switch (e.which) {
                        case 13 /* ENTER */:
                            this._toggleOptions();
                            break;
                        case 32 /* SPACE */:
                            if (!this._isOpen()) {
                                this._showOptions();
                            }
                            break;
                        case 27 /* ESCAPE */:
                            if (this._isOpen()) {
                                this._hideOptions();
                            }
                            break;
                        case 38 /* UP */:
                            this._selectPrevious();
                            e.preventDefault();
                            break;
                        case 37 /* LEFT */:
                            if (!this._isOpen()) {
                                this._selectPrevious();
                            }
                            break;
                        case 40 /* DOWN */:
                            this._selectNext();
                            e.preventDefault();
                            break;
                        case 39 /* RIGHT */:
                            if (!this._isOpen()) {
                                this._selectNext();
                            }
                            break;
                    }
                };
                return DropdownList;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.DropdownList = DropdownList;

            DropdownList.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$DropdownList$disposeInterface() {
                this._$list.off("click", this.getDelegate(this._onListClick));
                SDL.jQuery(window).off("scroll", this.getDelegate(this._hideOptions)).off("resize", this.getDelegate(this._onWindowResize));

                this._$title = undefined;
                this._$list = undefined;

                this._$elem.removeClass("sdl-dropdownlist open").off("click", this.getDelegate(this._onClick)).off("blur", this.getDelegate(this._onBlur)).off("keydown", this.getDelegate(this._onKeyDown)).empty();

                if (!this._initialTabIndex) {
                    this._$elem.removeAttr("tabIndex");
                } else {
                    this._$elem.attr("tabIndex", this._initialTabIndex);
                }

                this._$elem = undefined;
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.DropdownList", DropdownList);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
