/// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
module SDL.UI.Core.Controls
{
	export interface IControl
	{
		//constructor(element: HTMLElement, options?: any);
		render(callback?: () => void, errorcallback?: (error: string) => void): void;
		update?: (options?: any) => void;
		getElement?: () => HTMLElement;
	}

	export interface IControlType
	{
		new(element: Element, options?: any): IControl;
		createElement?: (document: HTMLDocument, options?: any) => HTMLElement;
	}

	export interface IPluginMethodDefinition
	{
		method: string;
		implementation?: string;
		returnsValue?: boolean;
	}

	export function getInstanceAttributeName(control: IControlType): string
	{
		return "data-__control__-" + SDL.Client.Types.Object.getUniqueId(control);
	}
}