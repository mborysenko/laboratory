/// <reference path="../Libraries/jQuery/SDL.jQuery.ts" />
/// <reference path="../Types/Types.d.ts" />
/// <reference path="../Diagnostics/Assert.d.ts" />
/// <reference path="../Event/Event.d.ts" />
/// <reference path="DisposableObject.d.ts" />

if (SDL.jQuery.inArray("data", (<any>SDL.jQuery).event.props) == -1)
{
	(<any>SDL.jQuery).event.props.push("data");	// ObjectWithEvents will be passing additional data in 'data' property
}

module SDL.Client.Types
{
	export interface IObjectWithEventsProperties extends IDisposableObjectProperties
	{
		handlers: {[event: string]: {fnc: Function}[];};
		timeouts: {[event: string]: any;};
	}

    export interface IObjectWithEvents extends IDisposableObject
    {
        addEventListener(event: string, handler: any) : void;
        removeEventListener(event: string, handler: any): void;
        fireGroupedEvent:
			{
				(event: string, eventData?: any, delay?: number): void;
				(event: JQueryEventObject, eventData?: any, delay?: number): void;
				(event: any, eventData?: any, delay?: number): void;
			};
        fireEvent:
			{
				(event: string, eventData?: any): Event.Event;
				(event: JQueryEventObject, eventData?: any): Event.Event;
				(event: any, eventData?: any): Event.Event;
			};
    };

	eval(SDL.Client.Types.OO.enableCustomInheritance);
    export class ObjectWithEvents extends DisposableObject implements IObjectWithEvents
    {
		properties: IObjectWithEventsProperties;

		constructor()
			{
				super();
				var p = this.properties;
				p.handlers = {};
				p.timeouts = {};
			}

        addEventListener(event: string, handler: Function) : void
			{
				var handlers = this.properties.handlers;
				if (handlers)
				{
					var e = handlers[event];
					if (!e)
					{
						e = handlers[event] = [];
					}
					e.push({fnc:handler});
				}
			}

        removeEventListener(event: string, handler: any): void
			{
				var handlers = this.properties.handlers;
				if (handlers)
				{
					var e = handlers[event];
					if (e)
					{
						var l = e.length;
						for (var i = 0; i < l; i++)
						{
							if (e[i].fnc == handler)
							{
								if (l == 1)
								{
									delete handlers[event];
								}
								else
								{
									for (var j = i + 1; j < l; j++)
									{
										e[j - 1] = e[j];
									}
									e.pop();
								}
								return;
							}
						}
					}
				}
			}

        fireGroupedEvent(event: string, eventData?: any, delay?: number): void;
		fireGroupedEvent(event: JQueryEventObject, eventData?: any, delay?: number): void;
		fireGroupedEvent(event: any, eventData?: any, delay?: number): void
			{
				var properties = this.properties;
				if (event in properties.timeouts)
				{
					clearTimeout(properties.timeouts[event]);
				}
				if (delay >= 0)
				{
					var self = this;
					properties.timeouts[event] = setTimeout(
						function()
						{
							delete properties.timeouts[event];
							self.fireEvent(event, eventData);
						}, delay);
				}
				else	//with delay < 0 or undefined can fire the previous group immediately
				{
					delete properties.timeouts[event];
					this.fireEvent(event, eventData);
				}
			}

        fireEvent(eventType: string, eventData?: any): Event.Event;
		fireEvent(event: JQueryEventObject, eventData?: any): Event.Event;
		fireEvent(eventType: any, eventData?: any): Event.Event
			{
				if (this.properties.handlers)
				{
					var eventObj: Event.Event;
					if (SDL.Client.Type.isObject(eventType))
					{
						eventObj = <JQueryEventObject>eventType;
						eventObj.target = this;
						eventType = eventObj.type;
						SDL.Client.Diagnostics.Assert.isString(eventType);
					}
					else
					{
						eventObj = new SDL.Client.Event.Event(eventType, this, eventData);
					}

					var result = this._processHandlers(eventObj, eventType);
					if (result !== false)
					{
						result = this._processHandlers(eventObj, "*");
					}

					if (result === false)
					{
						eventObj.defaultPrevented = true;
					}

					return eventObj;
				}
			}

		private _processHandlers(eventObj: any, handlersCollectionName: string): boolean
		{
			var p = this.properties;
			var handlers = p.handlers && p.handlers[handlersCollectionName];
			if (handlers)
			{
				var handlersClone = handlers.concat();	// creating a snapshot of handlers as newly added handlers should not be processed
				for (var i = 0, len = handlersClone.length; i < len && handlers; i++)
				{
					var handler = handlersClone[i];
					if (handlers.indexOf(handler) != -1)	// making sure not to call removed handlers
					{
						if (handler.fnc.call(this, eventObj) === false)	// if an event hadler returns false stop event handling
						{
							return false;
						}

						handlers = p.handlers && p.handlers[handlersCollectionName];
					}
				}
			}
		}

		_setDisposing(): void
		{
			this.fireEvent("beforedispose");
			this.callBase("SDL.Client.Types.DisposableObject", "_setDisposing");
			this.fireEvent("dispose");
		}
    };

	SDL.Client.Types.OO.createInterface("SDL.Client.Types.ObjectWithEvents", ObjectWithEvents);
}