/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
module SDL.UI.Core.Controls
{
	export interface IControl
	{
		//constructor(element: HTMLElement, options?: any, jQuery?: JQueryStatic);
		render(callback?: () => void, errorcallback?: (error: string) => void): void;
		update?: (options?: any) => void;
		getElement?: () => HTMLElement;
	}

	export interface IControlType
	{
		new(element: Element, options?: any, jQuery?: JQueryStatic): IControl;
		createElement?: (document: HTMLDocument, options?: any, jQuery?: JQueryStatic) => HTMLElement;
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