/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ControlRenderer.d.ts" />
/// <reference path="Base.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IControlBase extends IControl, Client.Types.IObjectWithEvents {
    }
    interface IControlBaseProperties extends Client.Types.IObjectWithEventsProperties {
        element: HTMLElement;
        options?: any;
    }
    class ControlBase extends Client.Types.ObjectWithEvents implements IControlBase {
        public properties: IControlBaseProperties;
        constructor(element: HTMLElement, options?: any);
        public update(options?: any): void;
        public $initialize(): void;
        public render(callback?: () => void, errorcallback?: (error: string) => void): void;
        public setRendered(callback?: () => void): void;
        public getElement(): HTMLElement;
        public dispose(): void;
    }
}
