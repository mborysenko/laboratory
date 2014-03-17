/*! @namespace {SDL.UI.Core.Utils.Dom} */
(function($)
{
	$.fn.parentWindow = function()
	{
		// assuming all elements are in the same window
		var elem = this[0];
		win = elem && elem.ownerDocument && (elem.ownerDocument.defaultView || elem.ownerDocument.parentWindow);
		return win ? $(win) : $();
	};

	$.fn.enableSelection = function()
	{
		return this.attr('unselectable', 'off')
				.css('user-select', 'text')
				.css('-webkit-user-select', 'text')
				.css('-moz-user-select', 'text')
				.css('-ms-user-select', 'text')
				.off("selectstart");
	};

	$.fn.disableSelection = function()
	{
		return this.attr('unselectable', 'on')
			.css('user-select', 'none')
			.css('-webkit-user-select', 'none')
			.css('-moz-user-select', '-moz-none')
			.css('-ms-user-select', 'none')
			.on("selectstart", function(e) { return $(e.target).is("input:text"); });
	};

	$.fn.unwrapInner = function()
	{
		$.each(this, function(index, element)
			{
				var child = element.firstChild;
				if (child)
				{
					while (child.firstChild)
					{
						element.insertBefore(child.firstChild, child);
					}
					element.removeChild(child);
				}
			});
		return this;
	};

	$.uniqueId = function SDL$Client$Types$Object$uniqueId()
	{
		return SDL.Client.Types.Object.getUniqueId(this[0]);
	};

})(SDL.jQuery);