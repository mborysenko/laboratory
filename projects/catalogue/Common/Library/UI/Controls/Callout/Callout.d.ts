/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Css/ZIndexManager.d.ts" />
/// <reference path="../ActionBar/ActionBar.jQuery.d.ts" />
declare module SDL.UI.Controls {
    enum CalloutPosition {
        ABOVE,
        BELOW,
        LEFT,
        RIGHT,
    }
    enum CalloutPurpose {
        GENERAL,
        MENU,
    }
    interface ICalloutTargetCoordinates {
        x: number;
        y: number;
    }
    interface ICalloutTargetBox {
        xLeft: number;
        xRight: number;
        yAbove: number;
        yBelow: number;
    }
    interface ICalloutOptions extends IActionBarOptions {
        targetElement?: HTMLElement;
        targetCoordinates?: ICalloutTargetCoordinates;
        targetBox?: ICalloutTargetBox;
        preferredPosition?: CalloutPosition;
        purpose?: CalloutPurpose;
        hideOnBlur?: boolean;
        bringToFront?: boolean;
        visible?: boolean;
    }
    interface ICalloutProperties extends Core.Controls.IFocusableControlBaseProperties {
        options: ICalloutOptions;
    }
    class Callout extends Core.Controls.FocusableControlBase {
        public properties: ICalloutProperties;
        private $element;
        private $actionbar;
        private isVisible;
        private pointer;
        private showTimeout;
        constructor(element: HTMLElement, options?: ICalloutOptions);
        public $initialize(): void;
        public update(options?: ICalloutOptions): void;
        public show(): void;
        public hide(): void;
        public setLocation(targetCoordinates: ICalloutTargetCoordinates): void;
        public setLocation(targetBox: ICalloutTargetBox): void;
        public getActionsFlag(): boolean;
        public handleFocusOut(): void;
        private _setLocation();
        private initCaptureFocus();
        private createActionBar();
        private onActionBarAction(e);
        private onActionBarActionFlagChange(e);
        private removeActionBar();
        private onKeyDown(e);
        private executeCloseAction();
        private onHide();
        private cleanUp();
    }
}
