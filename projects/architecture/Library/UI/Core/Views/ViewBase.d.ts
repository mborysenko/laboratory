/// <reference path="..\..\SDL.Client.Core\Types\ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ViewRenderer.d.ts" />
declare module SDL.UI.Core.Views
{
    class ViewBase extends SDL.Client.Types.ObjectWithEvents
    {
        constructor (element: Element, settings?: any);
        initialize(): void;
        render(callback?: () => void );
        getRenderOptions(): any;
        getTemplateData(): any;
        getTemplateRenderer(): SDL.UI.Core.Renderers.ITemplateRenderer;
        getTemplateName(): string;        
        getElement(): Element;        
    }
}
