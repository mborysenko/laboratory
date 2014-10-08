/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
declare module SDL.UI.Controls {
    enum ActivityIndicatorScreen {
        BRIGHT,
        DARK,
        NONE,
    }
    enum ActivityIndicatorSize {
        LARGE,
        MEDIUM,
        SMALL,
    }
    interface IActivityIndicatorOptions {
        text: string;
        size: ActivityIndicatorSize;
        screen: ActivityIndicatorScreen;
    }
    interface IActivityIndicatorProperties extends Core.Controls.IControlBaseProperties {
        options: IActivityIndicatorOptions;
    }
    class ActivityIndicator extends Core.Controls.ControlBase {
        public properties: IActivityIndicatorProperties;
        private $element;
        private $childElement;
        private rotateTimeout;
        private screenClass;
        private sizeClass;
        constructor(element: HTMLElement, options?: IActivityIndicatorOptions);
        public $initialize(): void;
        public update(options?: IActivityIndicatorOptions): void;
    }
}
