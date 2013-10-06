/// <reference path="Message.d.ts" />
declare module SDL.Client.Models.MessageCenter
{ 
    export class GoalMessage extends SDL.Client.Models.MessageCenter.Message
    {
        constructor (title:string, description:string, options?:any);
    }
}