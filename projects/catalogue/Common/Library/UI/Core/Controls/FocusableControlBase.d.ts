/// <reference path="ControlBase.d.ts" />
/// <reference path="../Event/Constants.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IFocusableControlBaseProperties extends IControlBaseProperties {
        $element: JQuery;
        initialTabIndex: string;
        capturingFocus: boolean;
        handlingResize: boolean;
        handlingScrollElement: HTMLElement;
        isPausedCaptureFocus: boolean;
        checkFocusedElementTimeout: number;
        isWindowFocusOut: boolean;
    }
    class FocusableControlBase extends ControlBase {
        public properties: IFocusableControlBaseProperties;
        public $initialize(): void;
        public handleFocusOut(): void;
        public startCaptureFocus(triggerOnResize?: boolean, triggerOnScroll?: HTMLElement): void;
        public stopCaptureFocus(): void;
        public pauseCaptureFocus(): void;
        private checkFocusedElement(focusOutHandler?);
        private onMouseDown(e);
        private onWindowFocusOut(e);
        private onWindowFocusIn();
        private stopWindowFocusOut();
        private checkFocusedElementAfterDelay(delay?);
        private cancelCheckFocusedElementAfterDelay();
        private onScroll(e);
        private onResize(e);
    }
}
