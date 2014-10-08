/// <reference path="../Libraries/knockout/knockout.d.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Knockout) {
                (function (BindingHandlers) {
                    ko.bindingHandlers.indeterminate = {
                        after: ["checked"],
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            //Only bind to checkboxes
                            if (element.type != "checkbox") {
                                return;
                            }

                            var onElementClick = function (e) {
                                if (ko.isWriteableObservable(valueAccessor())) {
                                    valueAccessor()(e.target.indeterminate);
                                }
                            };
                            ko.utils.registerEventHandler(element, "click", onElementClick);
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            element.indeterminate = !!ko.utils.unwrapObservable(valueAccessor());
                        }
                    };
                })(Knockout.BindingHandlers || (Knockout.BindingHandlers = {}));
                var BindingHandlers = Knockout.BindingHandlers;
            })(Core.Knockout || (Core.Knockout = {}));
            var Knockout = Core.Knockout;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=Indeterminate.js.map
