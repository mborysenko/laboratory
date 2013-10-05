/*6345,820,3510,3699,600,5636,557,1040,833,2770,3342*/var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
            /// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
            /// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
            /// <reference path="../Controls/ControlBase.ts" />
            (function (Renderers) {
                var ControlRenderer = (function () {
                    function ControlRenderer() {
                    }
                    ControlRenderer.renderControl = function (type, element, settings, callback, errorcallback) {
                        if (element) {
                            SDL.jQuery(element).data("control-create", true);
                        }

                        SDL.Client.Resources.ResourceManager.load(type, function () {
                            if (!element || SDL.jQuery(element).data("control-create")) {
                                var ctor = ControlRenderer.types[type];
                                if (!ctor) {
                                    ctor = ControlRenderer.types[type] = ControlRenderer.getTypeConstructor(type);
                                }

                                if (!element) {
                                    if (ctor.createElement) {
                                        element = ctor.createElement(document, settings, SDL.jQuery, callback ? (function () {
                                            return callback(control);
                                        }) : null, errorcallback);
                                    } else {
                                        element = document.createElement("div");
                                    }
                                }

                                // Instantiate the control
                                var control;
                                if (ctor.isAsynchronous) {
                                    var callbackInvoked = false;
                                    var _callback = callback ? function () {
                                        callbackInvoked = true;
                                        if (control) {
                                            callback(control);
                                            callback = null;
                                        }
                                    } : null;
                                    control = new ctor(element, settings, SDL.jQuery, _callback, errorcallback);
                                    if (callback && callbackInvoked) {
                                        callback(control);
                                    }
                                } else {
                                    control = new ctor(element, settings, SDL.jQuery);
                                    if (callback) {
                                        callback(control);
                                    }
                                }
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
                        if (control.getElement) {
                            SDL.jQuery(control.getElement()).removeData();
                        }
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
//@ sourceMappingURL=ControlRenderer.js.map
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
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
            /// <reference path="../Renderers/ControlRenderer.ts" />
            /// <reference path="Base.ts" />
            (function (Controls) {
                function createJQueryPlugin(jQuery, control, name, methods) {
                    jQuery.fn[name] = function SDL$UI$Core$ControlBase$widget(options) {
                        var _this = this;
                        var instances = [];
                        var jQueryObject = this;

                        jQueryObject.each(function () {
                            var element = this;
                            var attrName = Controls.getInstanceAttributeName(control);
                            var instance = element[attrName];
                            if (!instance || (instance.getDisposed && instance.getDisposed())) {
                                // create a control instance
                                instance = element[attrName] = new control(element, options, jQuery);
                            } else if (options && instance.update) {
                                // Call update on the existing instance
                                instance.update(options);
                            }
                            instances.push(instance);
                        });

                        jQueryObject = jQueryObject.pushStack(instances);

                        if (methods) {
                            jQuery.each(methods, function (i, methodDefinition) {
                                if (methodDefinition && methodDefinition.method) {
                                    jQueryObject[methodDefinition.method] = function () {
                                        var implementation = methodDefinition.implementation || methodDefinition.method;
                                        for (var i = 0, len = this.length; i < len; i++) {
                                            var instance = jQueryObject[i];
                                            var result = instance[implementation].apply(instance, arguments);
                                            if (methodDefinition.returnsValue) {
                                                return result;
                                            }
                                        }
                                        return jQueryObject;
                                    };
                                }
                            });

                            jQueryObject["dispose"] = function () {
                                for (var i = 0, len = this.length; i < len; i++) {
                                    SDL.UI.Core.Renderers.ControlRenderer.disposeControl(jQueryObject[i]);
                                }
                                return jQueryObject.end();
                            };
                        }

                        return jQueryObject;
                    };
                }
                Controls.createJQueryPlugin = createJQueryPlugin;
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//@ sourceMappingURL=jQuery.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/ObjectWithEvents.d.ts" />
            /// <reference path="../Renderers/ControlRenderer.ts" />
            /// <reference path="Base.ts" />
            (function (Controls) {
                eval(SDL.Client.Types.OO.enableCustomInheritance);
                var ControlBase = (function (_super) {
                    __extends(ControlBase, _super);
                    function ControlBase(element, options, jQuery, callback, errorcallback) {
                        _super.call(this);
                        var p = this.properties;
                        p.element = element;
                        p.options = options;
                        p.jQuery = jQuery;
                        p.callback = callback;
                        p.errorcallback = errorcallback;
                    }
                    ControlBase.prototype.update = function (options) {
                        this.properties.options = options;
                    };

                    ControlBase.prototype.$initialize = function () {
                        var controlType = SDL.Client.Type.resolveNamespace(this.getTypeName());
                        this.properties.element[Controls.getInstanceAttributeName(controlType)] = this;
                        Core.Renderers.ControlRenderer.onControlCreated(this);
                        this.render();
                    };

                    ControlBase.prototype.render = function () {
                        this.setRendered();
                    };

                    ControlBase.prototype.setRendered = function () {
                        var p = this.properties;
                        p.errorcallback = null;
                        if (p.callback) {
                            p.callback();
                            p.callback = null;
                        }
                    };

                    ControlBase.prototype.getElement = function () {
                        return this.properties.element;
                    };

                    ControlBase.prototype.getJQuery = function () {
                        return this.properties.jQuery;
                    };

                    ControlBase.prototype.dispose = function () {
                        this.callBase("SDL.Client.Types.ObjectWithEvents", "dispose");
                        Core.Renderers.ControlRenderer.onControlDisposed(this);
                    };
                    return ControlBase;
                })(SDL.Client.Types.ObjectWithEvents);
                Controls.ControlBase = ControlBase;

                ControlBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$Controls$ControlBase$disposeInterface() {
                });

                SDL.Client.Types.OO.createInterface("SDL.UI.Core.Controls.ControlBase", ControlBase);
            })(Core.Controls || (Core.Controls = {}));
            var Controls = Core.Controls;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//@ sourceMappingURL=ControlBase.js.map
/*! @namespace {SDL.UI.Core.Event.Constants} */
SDL.Client.Type.registerNamespace("SDL.UI.Core.Event.Constants");

/**
 * Defines the ASCII key codes for some common keys.
 * @enum
 */
SDL.UI.Core.Event.Constants.Keys =
{
	BACKSPACE: 8,
	ALT: 18,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGEDOWN: 34,
	PAGEUP: 33,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38,

	A: 65,
	C: 67,
	V: 86,
	X: 88,

	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Core) {
            /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Types.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/Array.d.ts" />
            /// <reference path="../../SDL.Client.Core/Types/OO.d.ts" />
            /// <reference path="../../SDL.Client.Core/Diagnostics/Assert.d.ts" />
            /// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
            (function (Renderers) {
                ;

                var ViewRenderer = (function () {
                    function ViewRenderer() {
                    }
                    ViewRenderer.registerTemplateRenderer = function (type, renderer) {
                        ViewRenderer.templateRenderers[type] = renderer;
                    };

                    ViewRenderer.getTemplateRenderer = function (type) {
                        return ViewRenderer.templateRenderers[type];
                    };

                    ViewRenderer.renderView = function (type, element, settings, callback, errorcallback) {
                        if (element) {
                            SDL.jQuery(element).data("view-create", true);
                        }

                        SDL.Client.Resources.ResourceManager.load(type, function () {
                            if (!element || SDL.jQuery(element).data("view-create")) {
                                var ctor = ViewRenderer.types[type];
                                if (!ctor) {
                                    ctor = ViewRenderer.types[type] = ViewRenderer.getTypeConstructor(type);
                                }

                                if (!element) {
                                    if (ctor.createElement) {
                                        element = ctor.createElement(document, settings);
                                    } else {
                                        element = document.createElement("div");
                                    }
                                }

                                // Instantiate the view
                                var view = new ctor(element, settings);
                                if (!SDL.Client.Types.OO.implementsInterface(view, "SDL.UI.Core.Views.ViewBase")) {
                                    SDL.Client.Diagnostics.Assert.raiseError("'" + type + "' must implement SDL.UI.Core.Views.ViewBase interface.");
                                }

                                // Render the view
                                view.render(!callback ? null : function () {
                                    callback(view);
                                });
                            }
                        }, errorcallback);
                    };

                    ViewRenderer.onViewCreated = function (view) {
                        var type = view.getTypeName();
                        if (ViewRenderer.createdViews[type]) {
                            ViewRenderer.createdViews[type].push(view);
                        } else {
                            ViewRenderer.createdViews[type] = [view];
                        }
                    };

                    ViewRenderer.disposeView = function (view) {
                        SDL.jQuery(view.getElement()).removeData();
                        view.dispose();
                    };

                    ViewRenderer.onViewDisposed = function (view) {
                        var type = view.getTypeName();
                        if (ViewRenderer.createdViews[type]) {
                            SDL.Client.Types.Array.removeAt(ViewRenderer.createdViews[type], ViewRenderer.createdViews[type].indexOf(view));
                        }
                    };

                    ViewRenderer.getCreatedViewCounts = function () {
                        var createdViews = {};
                        SDL.jQuery.each(ViewRenderer.createdViews, function (type, views) {
                            createdViews[type] = views.length;
                        });
                        return createdViews;
                    };

                    ViewRenderer.getTypeConstructor = function (type) {
                        SDL.Client.Diagnostics.Assert.isString(type, "View type name is expected.");

                        var ctor;
                        try  {
                            ctor = SDL.Client.Type.resolveNamespace(type);
                        } catch (err) {
                            SDL.Client.Diagnostics.Assert.raiseError("Unable to evaluate \"" + type + "\": " + err.description);
                        }
                        SDL.Client.Diagnostics.Assert.isFunction(ctor, "Unable to evaluate \"" + type + "\".");
                        return ctor;
                    };
                    ViewRenderer.templateRenderers = {};
                    ViewRenderer.types = {};
                    ViewRenderer.createdViews = {};
                    return ViewRenderer;
                })();
                Renderers.ViewRenderer = ViewRenderer;
                ;
            })(Core.Renderers || (Core.Renderers = {}));
            var Renderers = Core.Renderers;
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
;
//@ sourceMappingURL=ViewRenderer.js.map
/*! @namespace {SDL.UI.Core.Utils.Css} */
SDL.Client.Type.registerNamespace("SDL.UI.Core.Utils.Css");

SDL.UI.Core.Utils.Css.addDomClasses = function SDL$UI$Core$Utils$Css$addDomClasses(doc)
{
	var $documentElement = SDL.jQuery(doc.documentElement);
	if (SDL.jQuery.browser.msie)
	{
		$documentElement.addClass("ie");
	}
	else if (SDL.jQuery.browser.mozilla)
	{
		$documentElement.addClass("gecko");
	}
	else if (SDL.jQuery.browser.webkit)
	{
		$documentElement.addClass("webkit");
	}
};

SDL.UI.Core.Utils.Css.addDomClasses(document);
/*! @namespace {SDL.UI.Core.Utils.Dom} */
(function($)
{
	$.fn.parentWindow = function()
	{
		// assuming all elements are in the same window
		var elem = this[0];
		win = elem && elem.ownerDocument && (elem.ownerDocument.defaultView || elem.ownerDocument.parentWindow);
		return win ? $(win) : $();
	};

	$.fn.enableSelection = function()
	{
		return this.attr('unselectable', 'off')
				.css('user-select', 'text')
				.css('-webkit-user-select', 'text')
				.css('-moz-user-select', 'text')
				.css('-ms-user-select', 'text')
				.off("selectstart");
	};

	$.fn.disableSelection = function()
	{
		return this.attr('unselectable', 'on')
			.css('user-select', 'none')
			.css('-webkit-user-select', 'none')
			.css('-moz-user-select', '-moz-none')
			.css('-ms-user-select', 'none')
			.on("selectstart", function(e) { return $(e.target).is("input:text"); });
	};

	$.uniqueId = function SDL$Client$Types$Object$uniqueId()
	{
		return SDL.Client.Types.Object.getUniqueId(this[0]);
	};

})(SDL.jQuery);/*! @namespace {SDL.UI.Core.Utils.Event} */
SDL.Client.Type.registerNamespace("SDL.UI.Core.Utils.Event");

/**
 * Returns <c>true</c> if the current event was raised by a left mouse click.
 * @param {DOMEvent} e The event that was raised.
 * @return {Boolean} A value indicating whether the current event was raised by a left mouse click.
 */
SDL.UI.Core.Utils.Event.isLeftButton = function SDL$UI$Core$Utils$Event$isLeftButton(e)
{
	return e && (SDL.jQuery.browser.msie ? (e.button == 1 || e.type == "click") : e.button == 0) || false;
};

/**
 * Returns <c>true</c> if the event has Ctrl key set.
 * @param {DOMEvent} e The event.
 */
SDL.UI.Core.Utils.Event.ctrlKey = function SDL$UI$Core$Utils$Event$ctrlKey(e)
{
	return e && (SDL.jQuery.browser.macintosh ? (e.metaKey && !e.ctrlKey) : e.ctrlKey) || false;
};/*! @namespace {SDL.UI.Core.Views.ViewBase} */
SDL.Client.Types.OO.createInterface("SDL.UI.Core.Views.ViewBase");

/**
* Provides the base class for all tridion controls.
* @constructor
* @param {HTMLElement} markupElement The html element that contains the declarative markup for this control.
*/
SDL.UI.Core.Views.ViewBase.$constructor = function SDL$UI$Core$View$ViewBase$constructor(element, settings)
{
    this.addInterface("SDL.Client.Types.ObjectWithEvents");

    var p = this.properties;
	p.element = element;
	p.settings = settings;
};

SDL.UI.Core.Views.ViewBase.prototype.$initialize = function SDL$UI$Core$View$ViewBase$initialize()
{
	SDL.UI.Core.Renderers.ViewRenderer.onViewCreated(this);
	this.properties.templateName = this.getTypeName();
};

SDL.UI.Core.Views.ViewBase.prototype.getRenderOptions = function SDL$UI$Core$View$ViewBase$getRenderOptions()
{
	return null;
};

SDL.UI.Core.Views.ViewBase.prototype.render = function SDL$UI$Core$View$ViewBase$render(callback)
{
	this.getTemplateRenderer().render(this.getTemplateData(), this.properties.element, this.getRenderOptions(), callback);
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateData = function SDL$UI$Core$View$ViewBase$getTemplateData()
{
	var templateName = this.getTemplateName();
	var templateResource = SDL.Client.Resources.ResourceManager.getTemplateResource(templateName);
	if (!templateResource || !templateResource.loaded)
	{
		throw Error("Template resource '" + templateName + "' is not loaded.");
	}
	return templateResource.template;
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateRenderer = function SDL$UI$Core$View$ViewBase$getTemplateRenderer()
{
	var templateName = this.getTemplateName();
	var templateResource = SDL.Client.Resources.ResourceManager.getTemplateResource(templateName);
	if (!templateResource || !templateResource.loaded)
	{
		throw Error("Template resource '" + templateName + "' is not loaded.");
	}
	var renderer = SDL.UI.Core.Renderers.ViewRenderer.getTemplateRenderer(templateResource.type);
	if (!renderer)
	{
		throw Error("No renderer is registered for tempalte type '" + templateResource.type + "' (tempalte '" + templateName + "'). ");
	}
	return renderer;
};

SDL.UI.Core.Views.ViewBase.prototype.getTemplateName = function SDL$UI$Core$View$ViewBase$getTemplateName()
{
    return this.properties.templateName;
}

SDL.UI.Core.Views.ViewBase.prototype.getElement = function SDL$UI$Core$View$ViewBase$getElement()
{
    return this.properties.element;
}

SDL.UI.Core.Views.ViewBase.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Core$View$ViewBase$disposeInterface()
{
	SDL.UI.Core.Renderers.ViewRenderer.onViewDisposed(this);
});var SDL;
(function (SDL) {
    (function (UI) {
        /// <reference path="../../SDL.Client.Core/Libraries/jQuery/SDL.jQuery.d.ts" />
        /// <reference path="../../SDL.Client.Core/ConfigurationManager/ConfigurationManager.d.ts" />
        /// <reference path="../../SDL.Client.Core/Resources/ResourceManager.d.ts" />
        /// <reference path="../../SDL.Client.Core/Event/EventRegister.d.ts" />
        /// <reference path="../Renderers/ViewRenderer.ts" />
        /// <reference path="../Renderers/ControlRenderer.ts" />
        (function (Core) {
            var cm = SDL.Client.Configuration.ConfigurationManager;
            var rm = SDL.Client.Resources.ResourceManager;

            var pageNode;
            var pageNodes = SDL.Client.Xml.selectNodes(cm.configuration, "//configuration/pages/page[@url!='*' and @view]");
            var path = window.location.pathname.toLowerCase();

            for (var i = 0, len = pageNodes.length; i < len; i++) {
                var _pageNode = pageNodes[i];
                if (_pageNode.getAttribute("url").toLowerCase() == path) {
                    pageNode = _pageNode;
                    break;
                }
            }
            if (!pageNode) {
                pageNode = SDL.Client.Xml.selectSingleNode(cm.configuration, "//configuration/pages/page[@url='*' and @view]");
            }

            if (pageNode) {
                var view = pageNode.getAttribute("view");
                rm.load("SDL.UI.Core.Renderers.ViewRenderer", function () {
                    var target = document.getElementById("main-view-target") || document.body;
                    Core.Renderers.ViewRenderer.renderView(view, target, null, function (view) {
                        SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Event.EventRegister, "beforedispose", function () {
                            Core.Renderers.ViewRenderer.disposeView(view);
                        });
                    });

                    SDL.Client.Event.EventRegister.addEventListener("dispose", function () {
                        var undisposed = [];
                        SDL.jQuery.each(Core.Renderers.ViewRenderer.getCreatedViewCounts(), function (i, value) {
                            if (value != 0) {
                                undisposed.push(i + " (" + value + ")");
                            }
                        });

                        if (Core.Renderers.ControlRenderer != null) {
                            SDL.jQuery.each(Core.Renderers.ControlRenderer.getCreatedControlCounts(), function (i, value) {
                                if (value != 0) {
                                    undisposed.push(i + " (" + value + ")");
                                }
                            });
                        }

                        if (undisposed.length) {
                            alert("Some views/controls have been left undisposed:\n" + undisposed.join("\n"));
                        }
                    });
                });
                rm.load(view);
            }
        })(UI.Core || (UI.Core = {}));
        var Core = UI.Core;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//@ sourceMappingURL=init.js.map
