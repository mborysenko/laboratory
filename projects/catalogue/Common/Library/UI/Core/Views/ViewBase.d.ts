/// <reference path="..\..\SDL.Client.Core\Types\ObjectWithEvents.d.ts" />
/// <reference path="..\Renderers\ViewRenderer.d.ts" />
declare module SDL.UI.Core.Views
{
    class ViewBase extends SDL.Client.Types.ObjectWithEvents
    {
        constructor (element: HTMLElement, settings?: any);
        initialize(): void;
        render(callback?: () => void ): void;
        getRenderOptions(): any;
        getTemplateData(): any;
        getTemplateRenderer(): SDL.UI.Core.Renderers.ITemplateRenderer;
        getTemplateName(): string;        
        getElement(): HTMLElement;        
    }
}
