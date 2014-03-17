/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IControl {
        render(callback?: () => void, errorcallback?: (error: string) => void): void;
        update?: (options?: any) => void;
        getElement?: () => HTMLElement;
    }
    interface IControlType {
        new(element: Element, options?: any, jQuery?: JQueryStatic): IControl;
        createElement?: (document: HTMLDocument, options?: any, jQuery?: JQueryStatic) => HTMLElement;
    }
    interface IPluginMethodDefinition {
        method: string;
        implementation?: string;
        returnsValue?: boolean;
    }
    interface IPluginEventDefinition {
        event: string;
        originalEvent?: string;
    }
    function getInstanceAttributeName(control: IControlType): string;
}
