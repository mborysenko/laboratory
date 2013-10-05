/// <reference path="Message.d.ts" />
declare module SDL.Client.Models.MessageCenter
{ 
    export class QuestionMessage extends Message
    {
        confirm(): void;
        cancel(): void;
    }
}