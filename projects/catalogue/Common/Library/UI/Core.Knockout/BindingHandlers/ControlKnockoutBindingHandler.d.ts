/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.BindingHandlers {
    interface IControlKnockoutBinding {
        type?: string;
        handler?: string;
        controlsDescendantBindings?: boolean;
        data?: any;
    }
}
