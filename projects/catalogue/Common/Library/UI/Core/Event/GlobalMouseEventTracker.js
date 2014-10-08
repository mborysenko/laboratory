/// <reference path="../../SDL.Client.Core/Application/Application.d.ts" />
/// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Event) {
                (function (GlobalMouseEventTracker) {
                    if (SDL.Client) {
                        var Application = SDL.Client.Application;
                        if (Application) {
                            Application.addInitializeCallback(function () {
                                if (Application.isHosted && Application.ApplicationHost.isSupported("startCaptureDomEvents")) {
                                    document.addEventListener("mousedown", function () {
                                        Application.ApplicationHost.startCaptureDomEvents(["mouseup", "mousemove"]);
                                    });

                                    document.addEventListener("mouseup", function () {
                                        Application.ApplicationHost.stopCaptureDomEvents();
                                    });

                                    Application.ApplicationHost.addEventListener("domevent", function (e) {
                                        if (e.data.type == "mouseup") {
                                            SDL.Client.Application.ApplicationHost.stopCaptureDomEvents();
                                        }

                                        if (SDL.jQuery) {
                                            SDL.jQuery(document).trigger(e.data);
                                        }

                                        if (SDL.Client.Event) {
                                            var EventRegister = SDL.Client.Event.EventRegister;
                                            if (EventRegister) {
                                                EventRegister.handleEvent(document, e.data);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                })(Event.GlobalMouseEventTracker || (Event.GlobalMouseEventTracker = {}));
                var GlobalMouseEventTracker = Event.GlobalMouseEventTracker;
            })(Core.Event || (Core.Event = {}));
            var Event = Core.Event;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=GlobalMouseEventTracker.js.map
