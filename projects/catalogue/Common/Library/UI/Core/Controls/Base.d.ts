/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
declare module SDL.UI.Core.Controls {
    interface IControl {
        render(callback?: () => void, errorcallback?: (error: string) => void): void;
        update?: (options?: any) => void;
        getElement?: () => HTMLElement;
    }
    interface IControlType {
        new(element: Element, options?: any): IControl;
        createElement?: (document: HTMLDocument, options?: any) => HTMLElement;
    }
    interface IPluginMethodDefinition {
        method: string;
        implementation?: string;
        returnsValue?: boolean;
    }
    function getInstanceAttributeName(control: IControlType): string;
}
