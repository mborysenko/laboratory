/// <reference path="ApplicationHost.ts" />
module SDL.Client.ApplicationHost.ApplicationManifestReceiver
{
	export function registerApplication(applicationEntries: string)
	{
		ApplicationHost.registerApplication(applicationEntries);
	}
}