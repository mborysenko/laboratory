LVF.UI.Menu = LVF.UI.Menu || {};

LVF.UI.Menu = (function($)
{
    function Menu(options)
    {
        this.element = null;

        this.defaults = {

        };

        this.options = $.extend(this.defaults, options);

        this.initialize();
    }

    Menu.prototype.initialize = function()
    {
        var o = this.options;

        if((this.element = $(o.id)).length == 0)
        {
            throw new Error("Element not found");
        }

        var items = $(".lvf-menu_item", this.element);

        for(var i = 0, len = items.length; i < len; i++)
        {
            this.initMenuItem(items[i]);
        }
    };

    Menu.prototype.collapseOthers = function()
    {
    };

    Menu.prototype.initMenuItem = function(item)
    {
        item = $(item);
        var __this = this;
        item.mouseover(function(e)
        {
            e.preventDefault();
            __this.collapseOthers();
            var element = $(e.currentTarget);

            element.addClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);
        });

        item.mouseout(function(e)
        {
            e.preventDefault();
            var element = $(e.currentTarget);

            element.removeClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);
        })
    };

    return Menu;
})(jQuery);

LVF.UI.Menu.Constants = {
    MENU_STATE_HOVERED_CLASS: "__hovered"
};
