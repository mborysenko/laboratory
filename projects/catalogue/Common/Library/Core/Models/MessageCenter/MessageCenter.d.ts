/// <reference path="../../MessageCenter/MessageCenter.d.ts" />
/// <reference path="../MarshallableObject.d.ts" />

declare module SDL.Client.Models.MessageCenter
{
	export class MessageCenter extends SDL.Client.Models.MarshallableObject implements SDL.Client.MessageCenter.IMessageCenter
	{
		constructor();
		createMessage(messageType: SDL.Client.MessageCenter.MessageType, title: string, description: string, options: SDL.Client.MessageCenter.IMessageOptions): SDL.Client.MessageCenter.IMessage;
		registerMessage(message: SDL.Client.MessageCenter.IMessage): void;
		getMessageByID(id: string): SDL.Client.MessageCenter.IMessage;
		getMessages(): SDL.Client.MessageCenter.IMessage[];
		getActiveMessages(): SDL.Client.MessageCenter.IMessage[];
		executeAction(messageID: string, action: string, params: any[]): void;
	}
}