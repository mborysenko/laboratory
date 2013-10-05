/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../Renderers/ControlRenderer.d.ts" />
/// <reference path="Base.d.ts" />
declare module SDL.UI.Core.Controls {
    function createJQueryPlugin(jQuery: JQueryStatic, control: IControlType, name: string, methods?: IPluginMethodDefinition[]): void;
}
