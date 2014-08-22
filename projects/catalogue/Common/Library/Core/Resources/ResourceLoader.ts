/// <reference path="../ApplicationHost/ApplicationHost.ts" />
/// <reference path="../Application/Application.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="Resources.d.ts" />

module SDL.Client.Resources
{
	export class ResourceLoader
	{
		private static cdnCacheResponseHeaderName: string;

		static load(file: IFileResourceDefinition, corePath: string, sync: boolean,
			onSuccess: (data: string, isShared: boolean) => void,
			onFailure: (error: string) => void,
			caller?: ApplicationHost.ICallerSignature)
		{
			var isCommonResource: boolean = (file.url.indexOf("~/") == 0);

			if (isCommonResource && !sync && Application.isHosted && Application.useHostedLibraryResources)
			{
				Application.ApplicationHost.getCommonLibraryResource({url: file.url, version: file.version }, Application.libraryVersion,
					(data: string) => { onSuccess(data, true); }, onFailure);
			}
			else
			{
				var url = file.url;
				if (isCommonResource)
				{
					url = Types.Url.combinePath(corePath, url.slice(2));
				}

				if (file.version)
				{
					url = Types.Url.combinePath(url, "?" + file.version);
				}

				return Net.callWebMethod(url, "", "GET", null, sync,
					(data: string, request: Net.IWebRequest) =>
						{
							if (isCommonResource && (Application.isHosted || (Client.ApplicationHost && ApplicationHost.ApplicationHost)))
							{
								if (ResourceLoader.cdnCacheResponseHeaderName === undefined)
								{
									ResourceLoader.cdnCacheResponseHeaderName = Configuration.ConfigurationManager.getAppSetting("cdnCacheResponseHeaderName") || null;
								}

								var eventObject = {
									type: "Application Host API",
									data: url,
									resourceLocation: caller ? "shared" : "local",
									cdnCacheResponseHeader: ResourceLoader.cdnCacheResponseHeaderName
												? request.xmlHttp && request.xmlHttp.getResponseHeader(ResourceLoader.cdnCacheResponseHeaderName)
												: ""
								};

								if (Application.isHosted)
								{
									Application.ApplicationHost.triggerAnalyticsEvent("library-resource-load", eventObject);
								}
								else
								{
									ApplicationHost.ApplicationHost.triggerAnalyticsEvent("library-resource-load", eventObject, caller);
								}
							}
							onSuccess(data, false);
						},
					(error: string) =>
						{
							if (isCommonResource)
							{
								var eventObject = {
										type: "Application Host API",
										data: url,
										resourceLocation: caller ? "shared" : "local",
										error: error
									};

								if (Application.isHosted)
								{
									Application.ApplicationHost.triggerAnalyticsEvent("library-resource-load-fail", eventObject);
								}
								else if (Client.ApplicationHost && ApplicationHost.ApplicationHost)
								{
									ApplicationHost.ApplicationHost.triggerAnalyticsEvent("library-resource-load-fail", eventObject, caller);
								}
							}
							onFailure(error);
						});
			}
		}
	}
}