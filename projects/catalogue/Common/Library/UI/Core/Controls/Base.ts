/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
module SDL.UI.Core.Controls
{
	export interface IControl
	{
		//constructor(element: HTMLElement, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void);
		update?: (options?: any) => void;
		getElement?: () => HTMLElement;
		addEventListener?: (event: string, handler: any) => void;
        removeEventListener?: (event: string, handler: any) => void;
		dispose?: () => void;
		getDisposed?: () => boolean;
	}

	export interface IControlType
	{
		new(element: Element, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void): IControl;
		createElement?: (document: HTMLDocument, options?: any, jQuery?: JQueryStatic, callback?: () => void, errorcallback?: (error: string) => void) => HTMLElement;
		isAsynchronous?: boolean;
	}

	export interface IPluginMethodDefinition
	{
		method: string;
		implementation?: string;
		returnsValue?: boolean;
	}

	export interface IPluginEventDefinition
	{
		event: string;
		originalEvent?: string;
	}

	export function getInstanceAttributeName(control: IControlType): string
	{
		return "data-__control__-" + SDL.Client.Types.Object.getUniqueId(control);
	}
}