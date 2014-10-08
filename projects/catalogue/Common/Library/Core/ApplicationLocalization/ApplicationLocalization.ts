/// <reference path="../Localization/Localization.ts" />
/// <reference path="../Event/EventRegister.d.ts" />
/// <reference path="../Application/Application.ts" />

module SDL.Client.Application
{
	Application.addInitializeCallback(() =>
		{
			if (Application.isHosted && Configuration.ConfigurationManager.getAppSetting("synchronizeCultureWithApplicationHost") !== "false")
			{
				Event.EventRegister.addEventHandler(Application.ApplicationHost, "culturechange", () =>
					{
						Localization.setCulture(Application.ApplicationHost.culture)
					});
				Event.EventRegister.addEventHandler(Localization, "culturechange", (e: Client.Event.Event) =>
					{
						if (Application.ApplicationHost.culture != e.data.culture)
						{
							Application.ApplicationHost.setCulture(e.data.culture);
						}
					});
				Localization.setCulture(Application.ApplicationHost.culture);
			}
		});
} 