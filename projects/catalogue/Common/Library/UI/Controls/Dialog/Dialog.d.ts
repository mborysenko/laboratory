/// <reference path="../../SDL.Client.UI.Core/Controls/FocusableControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Css/ZIndexManager.d.ts" />
/// <reference path="../ActionBar/ActionBar.jQuery.d.ts" />
declare module SDL.UI.Controls {
    interface IDialogOptions extends IActionBarOptions {
        visible?: boolean;
        title: string;
    }
    interface IDialogProperties extends Core.Controls.IFocusableControlBaseProperties {
        options: IDialogOptions;
    }
    class Dialog extends Core.Controls.FocusableControlBase {
        public properties: IDialogProperties;
        private $element;
        private $actionbar;
        private isVisible;
        private $header;
        static $screen: JQuery;
        static shownDialogs: Dialog[];
        constructor(element: HTMLElement, options?: IDialogOptions);
        public $initialize(): void;
        public update(options?: IDialogOptions): void;
        public show(): void;
        public hide(): void;
        private createHeaderBar();
        private removeHeaderBar();
        private position();
        private onHide();
        public handleFocusOut(): void;
        public getActionsFlag(): boolean;
        private onKeyDown(e);
        private executeCloseAction();
        private createActionBar();
        private onActionBarAction(e);
        private onActionBarActionFlagChange(e);
        private removeActionBar();
        private static updateScreen();
        private static getTopmostDialog();
        private cleanUp();
    }
}
