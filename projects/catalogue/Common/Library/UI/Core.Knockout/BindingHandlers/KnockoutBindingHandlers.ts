module SDL.UI.Core.Knockout.BindingHandlers
{
	var knockoutObservableSettings: {[type: string]: boolean} = {};	// views that want original settings passed on, no knockout unwrapping should be done
	export function enableKnockoutObservableSettings(type: string): void
	{
		knockoutObservableSettings[type] = true;
	}

	export function areKnockoutObservableSettingsEnabled(type: string): boolean
	{
		return knockoutObservableSettings[type] || false;
	}
} 