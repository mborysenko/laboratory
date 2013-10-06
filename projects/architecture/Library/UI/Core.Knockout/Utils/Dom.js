(function($)
{
	var orig_remove = $.fn.remove;
	$.fn.remove = function(selector)
	{
		(selector ? this.filter(selector) : this)
		.each(function()
		{
			ko.cleanNode(this);
		});

		if (orig_remove)
		{
			return orig_remove.apply(this, arguments);
		}
	};
})(SDL.jQuery);