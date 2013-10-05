/*! @namespace {SDL.UI.Core.Utils.Event} */
SDL.Client.Type.registerNamespace("SDL.UI.Core.Utils.Event");

/**
 * Returns <c>true</c> if the current event was raised by a left mouse click.
 * @param {DOMEvent} e The event that was raised.
 * @return {Boolean} A value indicating whether the current event was raised by a left mouse click.
 */
SDL.UI.Core.Utils.Event.isLeftButton = function SDL$UI$Core$Utils$Event$isLeftButton(e)
{
	return e && (SDL.jQuery.browser.msie ? (e.button == 1 || e.type == "click") : e.button == 0) || false;
};

/**
 * Returns <c>true</c> if the event has Ctrl key set.
 * @param {DOMEvent} e The event.
 */
SDL.UI.Core.Utils.Event.ctrlKey = function SDL$UI$Core$Utils$Event$ctrlKey(e)
{
	return e && (SDL.jQuery.browser.macintosh ? (e.metaKey && !e.ctrlKey) : e.ctrlKey) || false;
};