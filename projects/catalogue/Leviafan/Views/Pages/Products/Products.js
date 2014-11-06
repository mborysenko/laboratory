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

            var Products = (function (_super) {
                __extends(Products, _super);
                function Products(element, settings) {
                    _super.call(this, element, settings);
                }
                Products.prototype.getRenderOptions = function () {
                    return this;
                };
                return Products;
            })(SDL.UI.Core.Views.ViewBase);
            Pages.Products = Products;

            SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Products", Products);
        })(Views.Pages || (Views.Pages = {}));
        var Pages = Views.Pages;
    })(LVF.Views || (LVF.Views = {}));
    var Views = LVF.Views;
})(LVF || (LVF = {}));
//# sourceMappingURL=Products.js.map