/// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
/// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
/// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
/// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
/// <reference path="../Controls/ControlBase.ts" />
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            (function (Renderers) {
                var ControlRenderer = (function () {
                    function ControlRenderer() {
                    }
                    ControlRenderer.renderControl = function (type, element, settings, callback, errorcallback) {
                        if (element) {
                            SDL.jQuery(element).data("control-create", true); // setting data to a value to be able to detect it when the element is removed from the DOM
                        }

                        SDL.Client.Resources.ResourceManager.load(type, function () {
                            if (!element || SDL.jQuery(element).data("control-create")) {
                                var ctor = ControlRenderer.types[type];
                                if (!ctor) {
                                    ctor = ControlRenderer.types[type] = ControlRenderer.getTypeConstructor(type);
                                }

                                if (!element) {
                                    if (ctor.createElement) {
                                        element = ctor.createElement(document, settings);
                                    } else {
                                        element = document.createElement("div");
                                    }
                                }

                                // Instantiate the control
                                var control = new ctor(element, settings);

                                // Render control
                                control.render(callback ? function () {
                                    callback(control);
                                } : null, errorcallback);
                            }
                        });
                    };

                    ControlRenderer.onControlCreated = function (control) {
                        var type = control.getTypeName();
                        if (ControlRenderer.createdControls[type]) {
                            ControlRenderer.createdControls[type].push(control);
                        } else {
                            ControlRenderer.createdControls[type] = [control];
                        }
                    };

                    ControlRenderer.disposeControl = function (control) {
                        if (control.dispose) {
                            control.dispose();
                        }
                    };

                    ControlRenderer.onControlDisposed = function (control) {
                        var type = control.getTypeName();
                        if (ControlRenderer.createdControls[type]) {
                            SDL.Client.Types.Array.removeAt(ControlRenderer.createdControls[type], ControlRenderer.createdControls[type].indexOf(control));
                        }
                    };

                    ControlRenderer.getCreatedControlCounts = function () {
                        var createdControls = {};
                        SDL.jQuery.each(ControlRenderer.createdControls, function (type, controls) {
                            createdControls[type] = controls.length;
                        });
                        return createdControls;
                    };

                    ControlRenderer.getTypeConstructor = function (type) {
                        SDL.Client.Diagnostics.Assert.isString(type, "Control type name is expected.");

                        var ctor;
                        try  {
                            ctor = SDL.Client.Type.resolveNamespace(type);
                        } catch (err) {
                            SDL.Client.Diagnostics.Assert.raiseError("Unable to evaluate \"" + type + "\": " + err.description);
                        }
                        SDL.Client.Diagnostics.Assert.isFunction(ctor, "Unable to evaluate \"" + type + "\".");
                        return ctor;
                    };
                    ControlRenderer.types = {};
                    ControlRenderer.createdControls = {};
                    return ControlRenderer;
                })();
                Renderers.ControlRenderer = ControlRenderer;
                ;
            })(Core.Renderers || (Core.Renderers = {}));
            var Renderers = Core.Renderers;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
;
//# sourceMappingURL=ControlRenderer.js.map
