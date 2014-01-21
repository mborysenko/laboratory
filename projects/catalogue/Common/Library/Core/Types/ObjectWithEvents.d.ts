/// <reference path="../Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="Types.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="DisposableObject.d.ts" />
declare module SDL.Client.Types {
    interface IObjectWithEvents extends Types.IDisposableObject {
        addEventListener(event: string, handler: any): void;
        removeEventListener(event: string, handler: any): void;
        fireGroupedEvent: {
            (event: string, eventData?: any, delay?: number): void;
            (event: JQueryEventObject, eventData?: any, delay?: number): void;
            (event: any, eventData?: any, delay?: number): void;
        };
        fireEvent: {
            (event: string, eventData?: any): Client.Event.Event;
            (event: JQueryEventObject, eventData?: any): Client.Event.Event;
            (event: any, eventData?: any): Client.Event.Event;
        };
    }
    class ObjectWithEvents extends Types.DisposableObject implements IObjectWithEvents {
        constructor();
        public addEventListener(event: string, handler: Function): void;
        public removeEventListener(event: string, handler: any): void;
        public fireGroupedEvent(event: string, eventData?: any, delay?: number): void;
        public fireGroupedEvent(event: JQueryEventObject, eventData?: any, delay?: number): void;
        public fireEvent(eventType: string, eventData?: any): Client.Event.Event;
        public fireEvent(event: JQueryEventObject, eventData?: any): Client.Event.Event;
        private _processHandlers(eventObj, handlersCollectionName);
        public _setDisposing(): void;
    }
}
