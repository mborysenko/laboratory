/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.Controls {
    function createKnockoutBinding(control: Core.Controls.IControlType, name: string): void;
    class KnockoutBindingHandler {
        private control;
        private name;
        private static eventHandlersAttributeName;
        private koDisposeCallbackHandler;
        constructor(control: Core.Controls.IControlType, name: string);
        public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void;
        public update(element: HTMLElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void;
        public disposeForElement(element: HTMLElement): void;
        private addEventHandlers(instance, controlEvents, values, viewModel);
        private removeEventHandlers(instance);
    }
}
