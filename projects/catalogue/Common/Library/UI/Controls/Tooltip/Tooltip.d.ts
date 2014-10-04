/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
declare module SDL.UI.Controls {
    interface ITooltipOptions {
        trackMouse?: boolean;
        relativeTo?: string;
        position?: string;
        offsetX?: number;
        offsetY?: number;
        fitToScreen?: boolean;
        delay?: number;
        showWhenCursorStationary?: boolean;
        showIfNoOverflow?: boolean;
        content?: string;
    }
    class Tooltip extends Core.Controls.ControlBase {
        static tooltipTimer: number;
        static shownTooltip: Tooltip;
        private $element;
        private settings;
        private mouse;
        private shown;
        constructor(element: HTMLElement, options?: ITooltipOptions);
        public $initialize(): void;
        public update(options?: ITooltipOptions): void;
        /**
        Show the tooltip either immediately, or after a short delay depending on the settings
        */
        public showTooltip(): void;
        /**
        Removes the tooltip from the DOM
        */
        public hideTooltip(): void;
        /**
        Handles mouseenter events
        */
        private onMouseEnter(e);
        /**
        Handles mouseleave events
        */
        private onMouseLeave();
        /**
        Track the mouse movements so that we can reposition the tooltips precisely
        */
        private onMouseMove(e);
        /**
        Show the tooltip
        */
        private doShowTooltip();
        /**
        Function to track the mouse so that we can precisely position the tooltip relative to the cursor after a short delay
        */
        private trackMouse(e);
    }
}
