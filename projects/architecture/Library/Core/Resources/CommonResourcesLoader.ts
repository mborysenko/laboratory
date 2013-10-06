/// <reference path="../Application/Application.ts" />
/// <reference path="..\Net/Ajax.d.ts" />
/// <reference path="..\CrossDomainMessaging\CrossDomainMessaging.ts" />

module SDL.Client.Resources
{
	export class CommonResourcesLoader
	{
		static load(file: IFileResourceDefinition, corePath: string, sync: boolean, onSuccess: (data: string) => void, onFailure: (error: string) => void)
		{
			var isCommonResource: boolean = (file.url.indexOf("~/") == 0);

			if (isCommonResource && !sync && Application.isHosted && Application.useHostedLibraryResources && Application.ApplicationHost.isTrusted)
			{
				Application.ApplicationHost.getCommonLibraryResource(file, Configuration.ConfigurationManager.coreVersion, onSuccess, onFailure);
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

				return Net.callWebMethod(url, "", "GET", null, sync, onSuccess, onFailure);
			}
		}
	}
}
