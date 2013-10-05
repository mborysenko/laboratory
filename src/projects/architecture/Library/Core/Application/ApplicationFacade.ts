/// <reference path="Application.ts" />
module SDL.Client.Application
{
	export interface ICallingApplicationData
	{
		applicationId: string;
		applicationDomain: string;
	}

	export var ApplicationFacade = {};
	export var isApplicationFacadeSecure: boolean = undefined;

	export module ApplicationFacadeStub
	{
		export function callApplicationFacade(method: string, arguments: any[], caller: ICallingApplicationData)
		{
			if (!Application.isHosted)
			{
				throw Error("Attempt to call Application facade failed: application is not hosted.");
			}
			else if (!ApplicationFacade[method])
			{
				throw Error("Attempt to call Application facade failed: method '" + method + "' is not defined.");
			}
			else if (isApplicationFacadeSecure == undefined)
			{
				throw Error("Attempt to call Application facade failed: unable to determine security level of the Application facade.");
			}
			else
			{
				if (isApplicationFacadeSecure)
				{
					if (!Application.ApplicationHost.isTrusted)
					{
						throw Error("Attempt to call secured Application facade failed: appliction host is untrusted.");
					}
					else if (!caller.applicationId || !caller.applicationDomain)
					{
						throw Error("Attempt to call secured Application facade failed: unable to determine the caller.");
					}
					else if (caller.applicationId != Application.applicationSuiteId || !Types.Url.isSameDomain(window.location.href, caller.applicationDomain))
					{
						if (!Application.trustedApplications && !Application.trustedApplicationDomains)
						{
							throw Error("Attempt to call secured Application facade failed: caller untrusted (" +
								caller.applicationId + ", " + caller.applicationDomain + ")");
						}
						else
						{
							var allowed: boolean;
							var i: number, len: number;
							if (Application.trustedApplications && caller.applicationId != Application.applicationSuiteId &&
								trustedApplications.indexOf(caller.applicationId) == -1)
							{
								throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationId + ")");
							}

							if (Application.trustedApplicationDomains && !Types.Url.isSameDomain(window.location.href, caller.applicationDomain) &&
								!Types.Url.isSameDomain(window.location.href, caller.applicationDomain))
							{
								allowed = false;
								for (i = 0, len = trustedApplicationDomains.length; i < len; i++)
								{
									if (Types.Url.isSameDomain(trustedApplicationDomains[i], caller.applicationDomain))
									{
										allowed = true;
										break;
									}
								}

								if (!allowed)
								{
									throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationDomain + ")");
								}
							}
						}
					}
				}

				var execute: any = (args) =>
					{
						return ApplicationFacade[method].apply(ApplicationFacade, args);
					};
				execute.applicationDomain = caller.applicationDomain;
				execute.applicationId = caller.applicationId;
				return execute(arguments || []);
			}
		}
	}
}