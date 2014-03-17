/// <reference path="../Application/Application.ts" />
/// <reference path="../Net/Ajax.d.ts" />
/// <reference path="Resources.d.ts" />

module SDL.Client.Resources
{
	export class ResourceLoader
	{
		static load(file: IFileResourceDefinition, corePath: string, sync: boolean, onSuccess: (data: string, isShared: boolean) => void, onFailure: (error: string) => void)
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

				return Net.callWebMethod(url, "", "GET", null, sync, (data: string) => { onSuccess(data, false); }, onFailure);
			}
		}
	}
}