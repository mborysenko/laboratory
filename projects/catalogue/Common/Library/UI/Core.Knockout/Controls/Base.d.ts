/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/Base.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Renderers/ControlRenderer.d.ts" />
/// <reference path="../Libraries/knockout/knockout.d.ts" />
/// <reference path="../Utils/knockout.d.ts" />
declare module SDL.UI.Core.Knockout.Controls {
    function createKnockoutBinding(control: Core.Controls.IControlType, name: string, events?: Core.Controls.IPluginEventDefinition[]): void;
}
