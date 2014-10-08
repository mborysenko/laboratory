/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Utils/Dom.d.ts" />
declare module SDL.UI.Controls {
    interface IScrollViewOptions {
        style?: string;
        overflowX?: string;
        overflowY?: string;
        overlay?: boolean;
    }
    interface IScrollViewProperties extends Core.Controls.IControlBaseProperties {
        options: IScrollViewOptions;
    }
    class ScrollView extends Core.Controls.ControlBase {
        public properties: IScrollViewProperties;
        private $element;
        private $scrollChild;
        private secondaryScrollBars;
        private $corner;
        private styleApplied;
        private overlayApplied;
        private childCreated;
        private initChildStyleBottom;
        private initChildStyleRight;
        private scrollBarChildBottom;
        private scrollBarChildRight;
        private scrollXEnabled;
        private scrollYEnabled;
        private scrollXHidden;
        private scrollYHidden;
        private secondaryToMainRatioX;
        private secondaryToMainRatioY;
        private scrollBarXWidth;
        private scrollBarYHeight;
        private scrollContentXWidth;
        private scrollContentYHeight;
        private scrollContentXClientWidth;
        private scrollContentYClientHeight;
        private scrollBarHandleXSize;
        private scrollBarHandleYSize;
        private scrollBarHandleXLeftPosition;
        private scrollBarHandleYTopPosition;
        private scrollHandleLeftPositionCoefficientX;
        private scrollHandleTopPositionCoefficientY;
        private monitoringInterval;
        private scrollButtonSize;
        private scrollChildLastScrollLeftPosition;
        private scrollChildLastScrollTopPosition;
        private scrollBarLastScrollLeftPosition;
        private scrollBarLastScrollTopPosition;
        constructor(element: HTMLElement, options?: IScrollViewOptions);
        public $initialize(): void;
        public update(options?: IScrollViewOptions): void;
        private getSecondaryScrollBar(direction);
        private updateScrollBars();
        private recalculate();
        private cancelScroll(e);
        private onScrollChild();
        private onSecondaryScrollX();
        private onSecondaryScrollY();
        private onScrollWrapperMouseMoveX(e);
        private onScrollWrapperMouseLeaveX(e);
        private onScrollWrapperMouseDownX(e);
        private onScrollWrapperMouseUpX(e);
        private onScrollWrapperMouseMoveY(e);
        private onScrollWrapperMouseLeaveY(e);
        private onScrollWrapperMouseDownY(e);
        private onScrollWrapperMouseUpY(e);
        private cleanUp();
    }
}
