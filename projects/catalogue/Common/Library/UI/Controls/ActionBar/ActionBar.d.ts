/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Button/Button.jQuery.d.ts" />
declare module SDL.UI.Controls {
    interface IActionBarAction {
        title: string;
        action?: string;
        handler?: () => void;
        purpose?: ButtonPurpose;
        iconClass?: IButtonIconClassOption;
        disabled?: boolean;
    }
    interface IActionBarActionFlag {
        label: string;
        selected: boolean;
    }
    interface IActionBarOptions {
        actions?: IActionBarAction[];
        actionFlag?: IActionBarActionFlag;
    }
    interface IActionBarProperties extends Core.Controls.IControlBaseProperties {
        options: IActionBarOptions;
    }
    class ActionBar extends Core.Controls.ControlBase {
        public properties: IActionBarProperties;
        private $element;
        private $actionFlagCheckbox;
        constructor(element: HTMLElement, options?: IActionBarOptions);
        public $initialize(): void;
        public update(options?: IActionBarOptions): void;
        public getActionFlag(): boolean;
        private createActionsFlagCheckbox();
        private removeActionsFlagCheckbox();
        private onActionFlagClick(e);
        private onActionClick(e);
        private insertActionButton(actionOptions, $insertBefore, insertSeparator?);
        private insertSeparator($button);
        private addButtonData($button, actionOptions);
        private updateButtonData($button, actionOptions);
        private removeActionButtons();
        private removeActionButton($button);
        private cleanUp();
    }
}
