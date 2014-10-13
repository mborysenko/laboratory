/// <reference path="../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LVF;
(function (LVF) {
    (function (Views) {
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
        Views.Dashboard = Dashboard;

        SDL.Client.Types.OO.createInterface("LVF.Views.Dashboard", Dashboard);
    })(LVF.Views || (LVF.Views = {}));
    var Views = LVF.Views;
})(LVF || (LVF = {}));
//# sourceMappingURL=Dashboard.js.map
