window.LVF.Application = LVF.Application || {};


LVF.Application = (function()
{
    function Application()
    {
        this.components = {};
        this.initialize();
    }

    Application.prototype.initialize = function ()
    {
        this.components['mainMenu'] = new LVF.UI.Menu({
            id: "#main-menu"
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

    return Application;
})();
