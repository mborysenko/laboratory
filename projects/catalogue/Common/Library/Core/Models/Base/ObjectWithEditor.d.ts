/// <reference path="../MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base
{
	export interface IObjectWithEditorProperties extends IMarshallableObjectProperties
	{
		display: Window;
	}
	export class ObjectWithEditor extends MarshallableObject
	{
		constructor(id: string);
		openInEditor(url: string, optWindow?: Window, params?: string, features?: string): Window;
		forceFocusToEditor(): void;
		getMessageItemAlreadyOpen(): string;
		closeEditor(): Window;
		onEditorUnload(): void;
		getEditor(): Window;
		expandEditorUrl(url: string, params: any): string;
		getShortcutUrl(url: string): string;
		properties: IObjectWithEditorProperties;
	}
}