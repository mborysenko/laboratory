LVF.UI.BaseMenu = (function ($)
{
    function BaseMenu(options)
    {
        if (!options.element)
        {
            console.log("Menu: Element has nod been defined");
            return;
        }

        this.defaults = {
            delayTimeout: 500 // milliseconds
        };
        this.children = [];
        this.element = null;
        this.delayTimer = false;
        this.delayTimeout = 0;

        this.options = $.extend(this.defaults, options);

        this.initialize();
    }

    BaseMenu.prototype.initialize = function ()
    {
        var options = this.options;

        this.element = options.element || null;
        this.delayTimeout = !isNaN(options.delayTimeout) ? options.delayTimeout : 0;


        var items = $(">.lvf-menu_item", this.element);
        for (var i = 0, len = items.length; i < len; i++)
        {
            this.initMenuItem(items[i]);
        }
    };

    BaseMenu.prototype.collapseOthers = function (except)
    {
        this.element.find(">.lvf-menu_item").not(except).removeClass(LVF.UI.Constants.MENU_STATE_HOVERED_CLASS);
    };

    BaseMenu.prototype.initMenuItem = function (item)
    {
        item = $(item);
        var __this = this;
        item.mouseover(function (e)
        {
            debugger;
            e.preventDefault();
            var element = $(e.currentTarget);
            __this.collapseOthers(element);

            if (__this.delayTimer)
            {
                clearTimeout(__this.delayTimer)
            }

            element.addClass(LVF.UI.Constants.MENU_STATE_HOVERED_CLASS);
        });

        item.mouseout(function (e)
        {
            e.preventDefault();

            __this.delayTimer = setTimeout(function ()
            {
                var element = $(e.currentTarget);
                element.removeClass(LVF.UI.Constants.MENU_STATE_HOVERED_CLASS);
            }, __this.delayTimeout)
        })

        if (item.hasClass("__has_children"))
        {
            var deeperMenu = item.find(">.lvf-menu_holder>.lvf-menu");

            this.children.push(new LVF.UI.AuxiliaryMenu({
                element: deeperMenu
            }));
        }
    };

    return BaseMenu;
})(jQuery);

LVF.UI.Menu = (function ($)
{

    function Menu(options)
    {
        Menu.superclass.constructor.call(this, options)
    }

    Menu.extend(LVF.UI.BaseMenu);

    return Menu;
})(jQuery)

LVF.UI.AuxiliaryMenu = (function ($)
{

    function AuxiliaryMenu(options)
    {
        AuxiliaryMenu.superclass.constructor.call(this, options)
    }

    AuxiliaryMenu.extend(LVF.UI.BaseMenu);


    AuxiliaryMenu.prototype.initMenuItem = function (item)
    {
        item = $(item);
        var __this = this;
        item.mouseover(function (e)
        {
            e.preventDefault();
            var element = $(e.currentTarget);
            __this.collapseOthers(element)

            if (__this.delayTimer)
            {
                clearTimeout(__this.delayTimer)
            }


            element.addClass(LVF.UI.Constants.MENU_STATE_HOVERED_CLASS);
            if (element.hasClass(LVF.UI.Constants.MENU_ITEM_HAS_CHILDREN_CLASS))
            {
                var itemId = element.attr("id");

                var holder = element.closest(".lvf-menu_holder.__lvl0");

                var menuItemsHolder = holder.find("#menu-for-" + itemId);
                menuItemsHolder.show();
            }
        });

        item.mouseout(function (e)
        {
            e.preventDefault();
            var element = $(e.currentTarget);

            __this.delayTimer = setTimeout(function ()
            {
                element.removeClass(LVF.UI.Constants.MENU_STATE_HOVERED_CLASS);
                if (element.hasClass(LVF.UI.Constants.MENU_ITEM_HAS_CHILDREN_CLASS))
                {
                    var itemId = element.attr("id");

                    var parentHolder = element.closest(".lvf-menu_holder.__lvl0");

                    var menuHolder = parentHolder.find("#menu-for-" + itemId);
                    menuHolder.hide();
                }
            }, __this.delayTimeout);
        })

        if (item.hasClass("__has_children"))
        {
            var deeperMenu = item.find(">.lvf-menu_holder>.lvf-menu");

            this.children.push(new LVF.UI.AuxiliaryMenu({
                element: deeperMenu
            }));
        }
    };


    return AuxiliaryMenu;
})(jQuery)

LVF.UI.Constants = {
    MENU_STATE_HOVERED_CLASS: "__hovered",
    MENU_ITEM_HAS_CHILDREN_CLASS: "__has_children"
};
