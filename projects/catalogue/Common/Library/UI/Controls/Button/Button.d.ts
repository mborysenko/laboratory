/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
declare module SDL.UI.Controls {
    interface IButtonIconClassOption {
        dark: string;
        light: string;
    }
    enum ButtonPurpose {
        GENERAL,
        CONFIRM,
        CRITICAL,
        PROCEED,
        TOGGLE,
        TOGGLE_IRREVERSIBLE,
    }
    enum ButtonStyle {
        DEFAULT,
        ICON,
        ICON_ROUND,
    }
    enum ButtonToggleState {
        OFF,
        ON,
    }
    interface IButtonOptions {
        purpose?: ButtonPurpose;
        style?: ButtonStyle;
        state?: ButtonToggleState;
        iconClass?: IButtonIconClassOption;
        disabled?: boolean;
    }
    interface IButtonProperties extends Core.Controls.IControlBaseProperties {
        options: IButtonOptions;
    }
    class Button extends Core.Controls.ControlBase {
        public properties: IButtonProperties;
        private $element;
        private pressed;
        private $icon;
        private tabIndex;
        private initialTabIndex;
        constructor(element: HTMLElement, options?: IButtonOptions);
        public $initialize(): void;
        public update(options?: IButtonOptions): void;
        public isOn(): boolean;
        public isOff(): boolean;
        public toggleOn(): void;
        public toggleOff(): void;
        public disable(): void;
        public enable(): void;
        public isDisabled(): boolean;
        private updateDisabledState();
        private onMouseDown(e);
        private onMouseUp(e);
        private onMouseLeave(e);
        private onKeyDown(e);
        private onKeyUp(e);
        private onDown();
        private onUp();
        private setStateStyle();
        private updateIconMarkup();
        private removeIconMarkup();
        private getPurposeClassName(purpose);
    }
}
