/// <reference path="../Types/Url1.ts" />

/**
 *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
**/
module SDL.Client.CrossDomainMessaging
{
	export interface IMessage
	{
		method?: string;
		args?: any[];
		respId?: number;
		reqId?: number;
		retire?: boolean;
		execute?: boolean;
	}

	export interface ICallbackHandler
	{
		(): void;
		reoccuring?: boolean;
		retire?: ()=>void;
	}

	var reqId: number = new Date().getTime();
	var callbacks: {[i: string]: any;} = {};
	var trustedDomains: string[] = [Types.Url.getDomain(window.location.href)];
	var allowedHandlerBases: any[];
	var parentXdm: {executeMessage(message: IMessage, source: Window, origin: string): void;} = undefined;

	export function addTrustedDomain(url: string): void
	{
		if (trustedDomains[0] != "*")
		{
			if (url == "*")
			{
				trustedDomains = ["*"];
			}
			else
			{
				for (var i = 0, len = trustedDomains.length; i < len; i++)
				{
					if (Types.Url.isSameDomain(trustedDomains[i], url))
					{
						return
					}
				}
				trustedDomains.push(url);
			}
		}
	}

	export function clearTrustedDomains(): void
	{
		trustedDomains = [];
	}

	export function addAllowedHandlerBase(handler: any): void
	{
		if (!allowedHandlerBases)
		{
			allowedHandlerBases = [handler];
		}
		else
		{
			allowedHandlerBases.push(handler);
		}
	}

	export function call(target: Window, method: string, args?: any[], callback?: (result: any) => void)
	{
		if (args)
		{
			for (var i = 0, len = args.length; i < len; i++)
			{
				if (typeof(args[i]) == "function")
				{
					var callbackId = (++reqId);
					callbacks[callbackId.toString()] = args[i];
					args[i] = {
						__callbackId: callbackId
					};
				}
			}
		}

		var obj: IMessage = {
			method: method,
			args: args
		};

		if (callback)
		{
			obj.reqId = (++reqId);
			callbacks[obj.reqId.toString()] = callback;
		}

		_postMessage(target, obj);
	}
	export function executeMessage(message: IMessage, source: Window, origin: string): void
	{
		if (message)
		{
			var execute: {(): void; sourceWindow?: Window; sourceDomain?: string;};
			if (message.method)
			{
				var parts = message.method.split(".");
				var lastIdx = parts.length - 1;
				var base: any = window;
				for (var i = 0; (i < lastIdx) && base; i++)
				{
					base = base[parts[i]];
				}

				if (!base)
				{
					throw Error("XDM: Unable to evaluate " + message.method);
				}
				else if (!base[parts[lastIdx]])
				{
					throw Error("XDM: Unable to evaluate " + message.method + ". Method '" + parts[lastIdx] + "' is not defined.");
				}
				else if (!allowedHandlerBases || allowedHandlerBases.indexOf(base) == -1)
				{
					throw Error("XDM: Access denied to " + message.method);
				}
				else
				{
					var result: any;
					var args = message.args;

					if (args)
					{
						for (var i = 0, len = args.length; i < len; i++)
						{
							if (args[i] && args[i].__callbackId)
							{
								args[i] = _createCallback(source, origin, args[i].__callbackId);
							}
						}

						execute = function()
						{
							return base[parts[lastIdx]].apply(base, message.args);
						};
					}
					else
					{
						execute = function()
						{
							return base[parts[lastIdx]]();
						};
					}

					execute.sourceWindow = source;
					execute.sourceDomain = Types.Url.getDomain(origin);

					result = execute();

					if (message.reqId)	//callback
					{
						_postMessage(source, {
							respId: message.reqId,
							args: [result]},
						origin);
					}
				}
			}
			else if (message.respId)
			{
				var callback = callbacks[message.respId.toString()];
				if (callback)
				{
					if (message.retire != false)
					{
						delete callbacks[message.respId.toString()];
					}
					if (message.execute != false)
					{
						execute = function()
						{
							callback.apply(window, message.args || <any[]>[]);
						};
						execute.sourceWindow = source;
						execute.sourceDomain = Types.Url.getDomain(origin);
						execute();
					}
				}
			}
		}
	}
	
	function _postMessage(target: Window, message: IMessage, origin?: string)
	{
		if (!origin)
		{
			origin = trustedDomains.length == 1 ? trustedDomains[0] : "*";
		}

		var remoteXdm: {executeMessage(message: IMessage, source: Window, origin: string): void;};

		if (origin == "*")
		{
			if (target == window.parent)
			{
				if (parentXdm === undefined)
				{
					try
					{
						parentXdm = (<any>target).SDL.Client.CrossDomainMessaging;
					}
					catch (err)
					{
						parentXdm = null;
					}
				}
				
				remoteXdm = parentXdm;
			}
		}
		else if (Types.Url.isSameDomain(origin, window.location.href))
		{
			try
			{
				remoteXdm = (<any>target).SDL.Client.CrossDomainMessaging;
			}
			catch (err)
			{ }
		}

		if (remoteXdm)
		{
			remoteXdm.executeMessage(message, window, window.location.href);
		}
		else
		{
			target.postMessage("sdl:" + (<any>window).JSON.stringify(message), origin);
		}
	}

	function _createCallback(target: Window, domain: string, callbackId: number): ICallbackHandler
	{
		var fnc: ICallbackHandler = function()
		{
			_postMessage(target,
				{
					respId: callbackId,
					retire: !fnc.reoccuring,
					args: [].slice.call(arguments)},
				domain);
		}
		fnc.retire = function()
		{
			_postMessage(target,
				{
					respId: callbackId,
					execute: false,
					retire: true},
				domain);
		}
		return fnc;
	}

	function _messageHandler(e: {data: string; source: Window; origin: string})
	{
		if (e && e.data && e.data.length > 4 && e.data.indexOf("sdl:") == 0)
		{
			var allowed = trustedDomains[0] == "*";
			if (!allowed)
			{
				for (var i = 0, len = trustedDomains.length; i < len; i++)
				{
					if (Types.Url.isSameDomain(trustedDomains[i], e.origin))
					{
						allowed = true;
						break;
					}
				}
			}
			
			if (allowed)
			{
				executeMessage((<any>window).JSON.parse(e.data.slice(4)), e.source, e.origin);
			}
		}
	}

	window.addEventListener("message", _messageHandler);
}