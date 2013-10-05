/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.BindingHandlers {
    interface IViewKnockoutBinding {
        type?: string;
        handler?: string;
        controlsDescendantBindings?: boolean;
        data?: any;
    }
}
