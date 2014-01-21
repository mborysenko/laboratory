/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IControl {
        update?: (options?: any) => void;
        getElement?: () => HTMLElement;
        addEventListener?: (event: string, handler: any) => void;
        removeEventListener?: (event: string, handler: any) => void;
        dispose?: () => void;
        getDisposed?: () => boolean;
    }
    interface IControlType {
        new(element: Element, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void): IControl;
        createElement?: (document: HTMLDocument, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void) => HTMLElement;
        isAsynchronous?: boolean;
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
