/// <reference path="..\MarshallableObject.d.ts" />
declare module SDL.Client.Models.Base
{ 
    export interface IObjectWithEditorProperties
    {
        display: any;
    }
    export class ObjectWithEditor extends MarshallableObject
    {
        constructor (id: any);
        openInEditor(url: string, optWindow?: Window, params?: string, features?: string): Window;
        forceFocusToEditor(): void;
        getMessageItemAlreadyOpen(): string;
        closeEditor(optwindow: any): any;
        onEditorUnload(): void;
        getEditor(): any;
        expandEditorUrl(url, params): any;
        getShortcutUrl(url): any;
        properties: IObjectWithEditorProperties;
    }
}