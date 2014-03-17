/// <reference path="../../SDL.Client.UI.Core/Renderers/ViewRenderer.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Views/ViewBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.d.ts" />
/// <reference path="KnockoutBindingHandlers.d.ts" />
declare module SDL.UI.Core.Knockout.BindingHandlers {
    interface IViewKnockoutBinding {
        type?: string;
        handler?: string;
        controlsDescendantBindings?: boolean;
        data?: any;
    }
}
