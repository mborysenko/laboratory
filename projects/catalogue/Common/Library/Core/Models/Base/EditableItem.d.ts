/// <reference path="../../Exception/ValidationException.d.ts" />
/// <reference path="Item.d.ts" />
declare module SDL.Client.Models.Base
{
	export interface WebRequest extends XMLHttpRequest
	{
		statusCode: number;
	}

	export interface IEditableItemProperties extends IItemProperties
	{
		saving: boolean;
	}

	export class EditableItem extends SDL.Client.Models.Base.Item
	{
		constructor(id: string);
		invalidateInterfaceCachedState(): void;
		canEditProperties(): boolean;
		setChanged(changeEventData?: any): void;
		isChanged(): boolean;
		canSave(): boolean;
		collectData(): void;
		save(): boolean;
		validate(): boolean;
		isSaving(): boolean;
		properties: IEditableItemProperties;
		_setSaving(): void;
		_setSaved(): void;
		_executeSave(): void;
		afterSetLoaded(): void;
		afterLoadFailed(error: string, webRequest: WebRequest): void;
		_addValidationResult(property: string, errorCode: number, message: string, description: string): void;
		removeValidationResult(property: string): void;
		getValidationException(): SDL.Client.Exception.ValidationException;
	}
}