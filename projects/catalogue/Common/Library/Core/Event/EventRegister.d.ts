declare module SDL.Client.Event
{
	interface IEventRegister extends Types.IObjectWithEvents
	{
		addEventHandler(object: Object, event: string, handler: Function, useCapture?: boolean): void;
		removeEventHandler(object: Object, event: string, handler: Function, useCapture?: boolean): void;
		removeAllEventHandlers(object: Object, event?: string): void;
		isLoading(): boolean;
		isUnloading(): boolean;
	}
	var EventRegister: IEventRegister;
}