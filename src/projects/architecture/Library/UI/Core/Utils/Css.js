/*! @namespace {SDL.UI.Core.Utils.Css} */
SDL.Client.Type.registerNamespace("SDL.UI.Core.Utils.Css");

SDL.UI.Core.Utils.Css.addDomClasses = function SDL$UI$Core$Utils$Css$addDomClasses(doc)
{
	var $documentElement = SDL.jQuery(doc.documentElement);
	if (SDL.jQuery.browser.msie)
	{
		$documentElement.addClass("ie");
	}
	else if (SDL.jQuery.browser.mozilla)
	{
		$documentElement.addClass("gecko");
	}
	else if (SDL.jQuery.browser.webkit)
	{
		$documentElement.addClass("webkit");
	}
};

SDL.UI.Core.Utils.Css.addDomClasses(document);
