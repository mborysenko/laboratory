/// <reference path="Message.d.ts" />
declare module SDL.Client.Models.MessageCenter
{ 
    export class ProgressMessage extends Message
    {
        setTitle(title: string);
        setContinuousIterationObject(id: number): void;
        collectCounts(item: any): void;
        getItems(): any[];
        getItemsCount(): number;
        getItemsDone(): any;
        getItemsDoneCount(): number;
        getItemsFailed: any;
        getItemsFailedCount(): number;
        finish(error: any): void;
        cancel(): void;
        canceled(): void;
        _onUpdate(event: any): void;
    }
}