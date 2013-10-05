/// <reference path="Message.d.ts" />
declare module SDL.Client.Models.MessageCenter
{ 
    export class ErrorMessage extends Message
    {
        getDetails(): any;        
    }
}