declare module SDL.Client.Event
{
    class Event
	{
        constructor (eventType?: string, eventTarget?: any, eventData?: any);      
		type: string;
        target: any;
        data: any;
        defaultPrevented: boolean;
    }
}
