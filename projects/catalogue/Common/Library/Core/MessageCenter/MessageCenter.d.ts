/// <reference path="..\Exception\Exception.d.ts" />

declare module SDL.Client.MessageCenter 
{
	export enum MessageType
	{
		NOTIFICATION,
		ERROR,
		WARNING,
		QUESTION,
		PROGRESS,
		GOAL
	}

	var MessageTypesRegistry: {[messageType: string]: string;};

	export interface IMessageOptions
	{
		localToWindow?: boolean;
	}

	export interface IMessage
	{
		getId(): string;
	}

	export interface IMessageCenter
	{
		createMessage(messageType: MessageType, title: string, description: string, options: IMessageOptions): IMessage;
		registerMessage(message: IMessage): void;
		getMessageByID(id: string): IMessage;
		getMessages(): IMessage[];
		getActiveMessages(): IMessage[];
		executeAction(messageID: string, action: string, params: any[]): void;
	}

	function getInstance(): IMessageCenter;
	function createMessage(messageType: MessageType, title: string, description: string, options: IMessageOptions): IMessage;
	function registerMessage(messageType: MessageType, title: string, description: string, options: IMessageOptions): void;
	function registerNotification(title: string, description: string, options: IMessageOptions): void;
	function registerError(title: string, description: string, options: IMessageOptions): void;
	function registerException(exception: Exception.Exception, options: IMessageOptions): void;
	function registerWarning(title: string, description: string, options: IMessageOptions): void;
	function registerQuestion(title: string, description: string, options: IMessageOptions): void;
	function registerProgress(title: string, description: string, options: IMessageOptions): void;
	function registerGoal(title: string, description: string, options: IMessageOptions): void;
	function getMessageByID(id: string): IMessage;
	function getMessages(): IMessage[];
	function getActiveMessages(): IMessage[];
	function executeAction(messageID: string, action: string, params: any[]): void;
	function addEventListener(event: string, handler: () => void): void;
	function removeEventListener(event: string, handler: () => void): void;
	function archiveLocalMessages(): void;
}

