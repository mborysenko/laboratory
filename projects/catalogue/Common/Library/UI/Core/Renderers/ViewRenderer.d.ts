/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
/// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
declare module SDL.UI.Core.Renderers {
    interface ITemplateRenderer {
        render(templateContent: string, target: HTMLElement, options: any, callback?: () => void): void;
    }
    class ViewRenderer {
        static templateRenderers: {
            [type: string]: ITemplateRenderer;
        };
        static types: {
            [index: string]: Function;
        };
        static createdViews: {
            [type: string]: any[];
        };
        static registerTemplateRenderer(type: string, renderer: ITemplateRenderer): void;
        static getTemplateRenderer(type: string): ITemplateRenderer;
        static renderView(type: string, element: HTMLElement, settings?: any, callback?: (view: any) => void, errorcallback?: (error: string) => void): void;
        static onViewCreated(view: Client.Types.OO.IInheritable): void;
        static disposeView(view: any): void;
        static onViewDisposed(view: Client.Types.OO.IInheritable): void;
        static getCreatedViewCounts(): {
            [type: string]: number;
        };
        private static getTypeConstructor(type);
    }
}
