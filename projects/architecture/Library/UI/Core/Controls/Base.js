var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Object.d.ts" />
            (function (Controls) {
                function getInstanceAttributeName(control) {
                    return "data-__control__-" + SDL.Client.Types.Object.getUniqueId(control);
                }
                Controls.getInstanceAttributeName = getInstanceAttributeName;
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//@ sourceMappingURL=Base.js.map
