/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
declare module SDL.UI.Controls {
    interface IDropdownListOption {
        value: string;
        text?: string;
    }
    interface IDropdownListOptions {
        options: IDropdownListOption[];
        disabled?: boolean;
        selectedValue?: string;
    }
    interface IDropdownListProperties extends Core.Controls.IControlBaseProperties {
        options: IDropdownListOptions;
    }
    class DropdownList extends Core.Controls.ControlBase {
        public properties: IDropdownListProperties;
        private _$elem;
        private _$list;
        private _$title;
        private _initialTabIndex;
        private _tabIndex;
        private _height;
        private _listHeight;
        private _windowHeight;
        public $initialize(): void;
        public update(options?: IDropdownListOptions): void;
        public disable(): void;
        public enable(): void;
        public isDisabled(): boolean;
        public getValue(): string;
        public setValue(value: string): void;
        private _initializeOptions(options);
        private _updateDisabledState();
        private _onWindowResize();
        private _hideOptions();
        private _showOptions();
        private _toggleOptions();
        private _isOpen();
        private _onClick();
        private _onBlur();
        private _getSelectedOption();
        private _updateSelectedValue();
        private _setSelectedOption($option);
        private _onListClick(e);
        private _selectNext();
        private _selectPrevious();
        private _onKeyDown(e);
    }
}
