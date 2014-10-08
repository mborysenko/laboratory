/// <reference path="../Libraries/knockout/knockout.d.ts" />

module SDL.UI.Core.Knockout.BindingHandlers
{
	(<any>ko.bindingHandlers).indeterminate = {
		after: ["checked"],

		init: (element: HTMLInputElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext) =>
		{
			//Only bind to checkboxes
			if (element.type != "checkbox")
			{
				return;
			}

			var onElementClick = (e: Event) =>
			{
				if (ko.isWriteableObservable(valueAccessor()))
				{
					valueAccessor()((<HTMLInputElement>e.target).indeterminate);
				}
			};
			ko.utils.registerEventHandler(element, "click", onElementClick);
		},

		update: (element: HTMLInputElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext) =>
		{
			element.indeterminate = !!ko.utils.unwrapObservable(valueAccessor());
		}
	};
}