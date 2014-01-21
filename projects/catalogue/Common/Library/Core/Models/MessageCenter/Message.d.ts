/// <reference path="..\..\MessageCenter\MessageCenter.d.ts" />
/// <reference path="..\MarshallableObject.d.ts" />

declare module SDL.Client.Models.MessageCenter
{ 
    export class Message extends SDL.Client.Models.MarshallableObject implements SDL.Client.MessageCenter.IMessage
    {
        constructor (title: string, description: string, options?: SDL.Client.MessageCenter.IMessageOptions); 
        getId(): string;
        getMessageType(): SDL.Client.MessageCenter.MessageType;
        getTitle(): string;
        getDescription(): string;
        getCreationDate(): Date;
        isActive(): boolean;
        getTargetWindow(): Window;
        getModalForWindow(): Window;
        expire(): void;
        archive(): void;
        getActions(): string[];
        addAction(action: string, name: string, options?: any, position?: number): void;
        populateActions(): void;
        clearActions(): void;
        setOption(name: string, value: any): void;
        getOption(name: string): any;
    }
}