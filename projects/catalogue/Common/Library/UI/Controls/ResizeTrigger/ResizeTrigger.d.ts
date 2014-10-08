/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    interface IResizeTriggerProperties extends Core.Controls.IControlBaseProperties {
    }
    class ResizeTrigger extends Core.Controls.ControlBase {
        private scrollTriggers;
        private resettingTriggers;
        private prevWidth;
        private prevHeight;
        private afterScrollExecuteRequest;
        private executeAfterDelay;
        private cancelExecuteAfterDelay;
        constructor(element: HTMLElement, options?: any);
        public $initialize(): void;
        private resetTriggers();
        private onScroll(e);
        private onAfterScroll();
        private isSizeChanged();
        private cleanUp();
    }
}
