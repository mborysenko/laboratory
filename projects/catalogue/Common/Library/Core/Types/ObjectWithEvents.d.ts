/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="Types.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="DisposableObject.d.ts" />
declare module SDL.Client.Types {
    interface IObjectWithEventsProperties extends IDisposableObjectProperties {
        handlers: {
            [event: string]: {
                fnc: Function;
            }[];
        };
        timeouts: {
            [event: string]: any;
        };
    }
    interface IObjectWithEvents extends IDisposableObject {
        addEventListener(event: string, handler: any): void;
        removeEventListener(event: string, handler: any): void;
        fireGroupedEvent: {
            (event: string, eventData?: any, delay?: number): void;
            (event: JQueryEventObject, eventData?: any, delay?: number): void;
            (event: any, eventData?: any, delay?: number): void;
        };
        fireEvent: {
            (event: string, eventData?: any): Event.Event;
            (event: JQueryEventObject, eventData?: any): Event.Event;
            (event: any, eventData?: any): Event.Event;
        };
    }
    class ObjectWithEvents extends DisposableObject implements IObjectWithEvents {
        public properties: IObjectWithEventsProperties;
        constructor();
        public addEventListener(event: string, handler: Function): void;
        public removeEventListener(event: string, handler: any): void;
        public fireGroupedEvent(event: string, eventData?: any, delay?: number): void;
        public fireGroupedEvent(event: JQueryEventObject, eventData?: any, delay?: number): void;
        public fireEvent(eventType: string, eventData?: any): Event.Event;
        public fireEvent(event: JQueryEventObject, eventData?: any): Event.Event;
        private _processHandlers(eventObj, handlersCollectionName);
        public _setDisposing(): void;
    }
}
