/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LVF;
(function (LVF) {
    (function (Views) {
        (function (Pages) {
            eval(SDL.Client.Types.OO.enableCustomInheritance);

            var Dashboard = (function (_super) {
                __extends(Dashboard, _super);
                function Dashboard(element, settings) {
                    _super.call(this, element, settings);
                }
                Dashboard.prototype.getRenderOptions = function () {
                    return this;
                };
                return Dashboard;
            })(SDL.UI.Core.Views.ViewBase);
            Pages.Dashboard = Dashboard;

            SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Dashboard", Dashboard);
        })(Views.Pages || (Views.Pages = {}));
        var Pages = Views.Pages;
    })(LVF.Views || (LVF.Views = {}));
    var Views = LVF.Views;
})(LVF || (LVF = {}));
//# sourceMappingURL=Dashboard.js.map
