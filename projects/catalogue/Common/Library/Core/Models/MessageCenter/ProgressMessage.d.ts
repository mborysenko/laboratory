/// <reference path="Message.d.ts" />
/// <reference path="../Base/ContinuousIterationObject.d.ts" />
declare module SDL.Client.Models.MessageCenter
{ 
    export class ProgressMessage extends Message
    {
        setTitle(title: string);
        setContinuousIterationObject(id: string): void;
        collectCounts(item?: Base.ContinuousIterationObject): void;
        getItems(): any[];
        getItemsCount(): number;
        getItemsDone(): any[];
        getItemsDoneCount(): number;
        getItemsFailed: any[];
        getItemsFailedCount(): number;
        finish(error: any): void;
        cancel(): void;
        canceled(): void;
        _onUpdate(event: Event.Event): void;
    }
}