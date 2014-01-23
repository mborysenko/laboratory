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
            (typeof console != 'undefined') && console.log("Element" + o.id + " not found");
            return;
        }

        var items = $(">.lvf-menu_item", this.element);

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
        item
            .mouseover(this.onMenuItemHovered)
            .mouseout(this.onMenuItemLeft);

        var deeperMenu = item.find(".lvf-menu_holder.__lvl0>.lvf-menu");

        var deeperItems = deeperMenu.find(">.lvf-menu_item");

        for (var i = 0, len = deeperItems.length; i < len; i++)
        {
            this.initDeeperMenuItem(deeperItems[i]);
        }
    };

    Menu.prototype.onMenuItemHovered = function(e)
    {
        e.preventDefault();

        var element = $(e.currentTarget);

        element.addClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);
    };

    Menu.prototype.onDeeperMenuItemHovered = function(e)
    {
        e.preventDefault();

        var element = $(e.currentTarget);

        element.addClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);

        if(element.hasClass(LVF.UI.Menu.Constants.MENU_ITEM_HAS_CHILDREN_CLASS))
        {
            var itemId = element.attr("id");

            var parentHolder = element.closest(".lvf-menu_holder.__lvl0");

            var menuHolder = parentHolder.find("#menu-for-" + itemId);
            menuHolder.show();

        }
    };

    Menu.prototype.onMenuItemLeft = function(e)
    {
        e.preventDefault();
        var element = $(e.currentTarget);

        element.removeClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);
    };

    Menu.prototype.onDeeperMenuItemLeft = function(e)
    {
        e.preventDefault();
        var element = $(e.currentTarget);

        element.removeClass(LVF.UI.Menu.Constants.MENU_STATE_HOVERED_CLASS);
        if(element.hasClass(LVF.UI.Menu.Constants.MENU_ITEM_HAS_CHILDREN_CLASS))
        {
            var itemId = element.attr("id");

            var parentHolder = element.closest(".lvf-menu_holder.__lvl0");

            var menuHolder = parentHolder.find("#menu-for-" + itemId);
            menuHolder.hide();
        }

    };

    Menu.prototype.initDeeperMenuItem = function(item)
    {
        item = $(item);

        item
            .mouseover(this.onDeeperMenuItemHovered)
            .mouseout(this.onDeeperMenuItemLeft);
    };


    return Menu;
})(jQuery);

LVF.UI.Menu.Constants = {
    MENU_STATE_HOVERED_CLASS: "__hovered",
    MENU_ITEM_HAS_CHILDREN_CLASS: "__has_children"
};
