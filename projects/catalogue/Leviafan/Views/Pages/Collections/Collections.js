/// <reference path="../../../../Common/Library/Core/Types/OO.d.ts" />
/// <reference path="../../../../Common/Library/UI/Core/Views/ViewBase.d.ts" />
/// <reference path="../../../ViewModelItems/CollectionList.ts" />
/// <reference path="../../../Models/CollectionList.ts" />
/// <reference path="../../../Models/Factory.ts" />
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

            var Collections = (function (_super) {
                __extends(Collections, _super);
                function Collections(element, settings) {
                    _super.call(this, element, settings);
                }
                Collections.prototype.getRenderOptions = function () {
                    var p = this.properties;
                    var store = LVF.Models.Factory.getSystemRoot();
                    var list = store.getCollectionList();
                    var item = new LVF.ViewModelItems.CollectionList(list);

                    var view = p.model = new LVF.ViewModels.CollectionList(item);

                    list.load(true);

                    return view;
                };
                return Collections;
            })(SDL.UI.Core.Views.ViewBase);
            Pages.Collections = Collections;

            SDL.Client.Types.OO.createInterface("LVF.Views.Pages.Collections", Collections);
        })(Views.Pages || (Views.Pages = {}));
        var Pages = Views.Pages;
    })(LVF.Views || (LVF.Views = {}));
    var Views = LVF.Views;
})(LVF || (LVF = {}));
//# sourceMappingURL=Collections.js.map
