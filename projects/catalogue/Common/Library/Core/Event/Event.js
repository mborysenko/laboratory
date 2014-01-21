/*! @namespace {SDL.Client.Event.Event} */
SDL.Client.Type.registerNamespace("SDL.Client.Event");

/**
 * Represents the event that was fired.
 * @param {String} eventType The name of the event being fired.
 * @param {Object} eventTarget The object that fires the event.
 * @param {Object} eventData Additional data that this event passes.
 */
SDL.Client.Event.Event = function SDL$Client$Event$Event(eventType, eventTarget, eventData)
{
	SDL.Client.Diagnostics.Assert.isString(eventType);
	SDL.Client.Diagnostics.Assert.isObject(eventTarget);

	this.type = eventType;
	this.target = eventTarget;
	this.data = eventData;
	this.timeStamp = SDL.jQuery.now();
	this.defaultPrevented = false;
	this.preventDefault = function()
	{
		this.defaultPrevented = true;
	}
};