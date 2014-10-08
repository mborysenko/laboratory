/// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
/// <reference path="../Renderers/ViewRenderer.d.ts" />
declare module SDL.UI.Core.Views
{
	export interface IViewBaseProperties extends SDL.Client.Types.IObjectWithEventsProperties
	{
		settings: any;
		element: HTMLElement;
	}

	class ViewBase extends SDL.Client.Types.ObjectWithEvents
	{
		properties: IViewBaseProperties;
		constructor(element: HTMLElement, settings?: any);
		render(callback?: () => void): void;
		getRenderOptions(): any;
		getTemplateData(): any;
		getTemplateResource(): SDL.Client.Resources.IFileResource;
		getTemplateRenderer(): SDL.UI.Core.Renderers.ITemplateRenderer;
		getTemplateName(): string;
		getElement(): HTMLElement;
	}
}
