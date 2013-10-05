/// <reference path="..\..\Exception\ValidationException.d.ts" />
/// <reference path="Item.d.ts" />
declare module SDL.Client.Models.Base
{ 
    export interface WebRequest extends XMLHttpRequest
    { 
        statusCode: number;
    }

    export interface IEditableItemProperties
    { 
        saving: boolean;
    }

    export class EditableItem extends SDL.Client.Models.Base.Item
    {
        constructor (id:any);
        canEditProperties(): boolean;
        isChanged(): boolean;
        canSave(): boolean;
        save(): boolean;
        isSaving(): boolean;
         properties: any ;
        _setSaving(): void;
        _setSaved(): void;
        _executeSave(): void;
        afterSetLoaded(): void;
        afterLoadFailed(error:string, webRequest:WebRequest): void;
		_addValidationResult(property: string, errorCode: number, message: string, description: string): void;
		removeValidationResult(property: string): void;
		getValidationException(): SDL.Client.Exception.ValidationException;
    }
}