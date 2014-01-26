window.LVF.Application = LVF.Application || {};

LVF.Application = (function ()
{
    function Application()
    {
        this.components = {};
        this.initialize();
    }

    Application.prototype.initialize = function ()
    {
        this.components['mainMenu'] = new LVF.UI.Menu({
            element: $("#main-menu")
        });

        this.components['userMenu'] = new LVF.UI.Menu({
            element: $("#user-menu")
        });

        console.log("Info: main application has been initialized");
    };

    Application.prototype.run = function ()
    {
        console.log("Info: main application is running");
    };

    Application.prototype.getMainMenu = function ()
    {
        return this.components['mainMenu'];
    };

    Application.prototype.getUserMenu = function ()
    {
        return this.components['userMenu'];
    };

    return Application;
})();
