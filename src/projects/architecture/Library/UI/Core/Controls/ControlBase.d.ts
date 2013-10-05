/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ControlRenderer.d.ts" />
/// <reference path="Base.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IControlBase extends Controls.IControl, SDL.Client.Types.IObjectWithEvents {
        getJQuery?: () => JQueryStatic;
    }
    class ControlBase extends SDL.Client.Types.ObjectWithEvents implements IControlBase {
        constructor(element: HTMLElement, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void);
        public update(options?: any): void;
        public $initialize(): void;
        public render(): void;
        public setRendered(): void;
        public getElement(): HTMLElement;
        public getJQuery(): JQueryStatic;
        public dispose(): void;
    }
}
