/// <reference path="EditableItem.d.ts" />
declare module SDL.Client.Models.Base
{ 
    export interface IVersionableItemProperties
    { 
        checkingOut: boolean;
        cancelingCheckOut: boolean;
        checkingIn: boolean;
        canCheckOut: boolean;
        canCheckIn: boolean;
        canCancelCheckOut: boolean;
    }
    export class VersionableItem extends SDL.Client.Models.Base.EditableItem
    {
        constructor (id: any);
        invalidateInterfaceCachedState(invalidateInterfaceCachedState?: Function): void;
        canCheckOut(): boolean;
        canCheckIn(): boolean;
        canCancelCheckOut(): boolean;
        save(doneEditing?: boolean): boolean;
        isCheckedOut(): boolean;
        isCheckingOut(): boolean;
		_setCheckingOut(): void;
        _setCheckedOut(): void;
        _setCheckOutFailed(error, webRequest): void;
        checkOut(): boolean;
        _executeCheckOut(): void;
        isCancelingCheckOut(): boolean;
        _setCancelingCheckOut(): void;
        _setCanceledCheckOut(): void;
        _setCancelCheckOutFailed(error, webRequest): void;
        cancelCheckOut(): boolean;
        _executeCancelCheckOut(): void;
        isCheckingIn(): boolean;
        _setCheckingIn(): void;
        _setCheckedIn(): void;
        _setCheckInFailed(error, webRequest): void;
        checkIn(): boolean;
        _executeCheckIn(): void;
        afterSetLoaded(): void;
		afterLoadFailed(error: string, webRequest: WebRequest): void;        
    }
}