var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="globalize.d.ts" />
/// <reference path="../jQuery/SDL.jQuery.ts" />
/// <reference path="../../Types/Types.d.ts" />
/// <reference path="../../Types/Date.d.ts" />
/// <reference path="../../Types/String.d.ts" />
/// <reference path="../../Localization/Localization.ts" />
/// <reference path="../../Event/EventRegister.d.ts" />
/// <reference path="../../Resources/FileResourceHandler.ts" />
// load this module before globalize.js
var SDL;
(function (SDL) {
    ;

    eval(SDL.Client.Types.OO.enableCustomInheritance);
    var GlobalizeClass = (function (_super) {
        __extends(GlobalizeClass, _super);
        function GlobalizeClass() {
            var _this = this;
            _super.call(this);

            this._globalize = (window).Globalize;

            Object.defineProperty(this, "cultures", {
                get: function () {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    return this._globalize.cultures;
                },
                set: function (value) {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    this._globalize.cultures = value;
                },
                enumerable: true
            });

            Object.defineProperty(this, "cultureSelector", {
                get: function () {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    return this._globalize.cultureSelector;
                },
                set: function (value) {
                    if (!this._globalize)
                        throw "SDL.Globalize is not initialized.";
                    this._globalize.cultureSelector = value;
                },
                enumerable: true
            });

            SDL.Client.Event.EventRegister.addEventHandler(SDL.Client.Localization, "culturechange", function (e) {
                if (_this._globalize) {
                    _this.culture(e.data.culture);
                }
                SDL.Client.Resources.FileResourceHandler.updateCultureResources(function () {
                    _this.fireEvent("culturechange", { culture: e.data.culture });
                });
            });
        }
        GlobalizeClass.prototype.initializeNoConflict = function () {
            var _globalize = (window).Globalize;

            if (_globalize != this._globalize) {
                (window).Globalize = this._globalize;
                this._globalize = _globalize;
            }

            if (_globalize) {
                this.culture(SDL.Client.Localization.getCulture());
            }
        };

        GlobalizeClass.prototype.TranslateDate = function (date) {
            var date = SDL.Client.Types.Date.parse(date);
            return this.format(date, "d") + " " + this.format(date, "t");
        };

        GlobalizeClass.prototype.init = function (cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.init.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.culture = function () {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            if (arguments.length == 1) {
                var culture = arguments[0];
                if (!culture) {
                    return;
                } else if (SDL.Client.Type.isString(culture) && SDL.Client.Localization.getCulture() != culture) {
                    SDL.Client.Localization.setCulture(culture);
                    return;
                }
            }

            return this._globalize.culture.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.addCultureInfo = function (cultureName, baseCultureName, info) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            if (typeof cultureName !== "string") {
                // cultureName argument is optional string. If not specified, assume info is first
                // and only argument. Specified info deep-extends current culture.
                info = cultureName;
                cultureName = baseCultureName = this.culture().name;
            } else if (typeof baseCultureName !== "string") {
                // baseCultureName argument is optional string. If not specified, assume info is second
                // argument. Specified info deep-extends specified culture.
                // If specified culture does not exist, create by deep-extending default
                info = baseCultureName;
                baseCultureName = !this.cultures[cultureName] ? "default" : cultureName;
            } else {
                // cultureName and baseCultureName specified
                base = this.cultures[baseCultureName];
            }

            var isNew = !this.cultures[cultureName];
            var base = this.cultures[baseCultureName];
            var prevMessages = isNew ? null : this.cultures[cultureName].messages;

            this.cultures[cultureName] = SDL.jQuery.extend(true, {}, base, info, { messages: null }, { messages: SDL.jQuery.extend({}, prevMessages, info.messages) });

            if (isNew) {
                this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
            }
        };

        GlobalizeClass.prototype.findClosestCulture = function (cultureSelector, skipCount) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";

            var match;
            if (cultureSelector == undefined) {
                cultureSelector = this._globalize.cultureSelector;
            }

            if (cultureSelector) {
                var names = SDL.Client.Type.isString(cultureSelector) ? cultureSelector.split(",") : cultureSelector;

                if (SDL.Client.Type.isArray(names)) {
                    var lang, cultures = this._globalize.cultures, list = names, i, l = list.length, prioritized = [];
                    for (i = 0; i < l; i++) {
                        cultureSelector = SDL.jQuery.trim(list[i]);
                        var pri, parts = cultureSelector.split(";");
                        lang = SDL.jQuery.trim(parts[0]);
                        if (parts.length === 1) {
                            pri = 1;
                        } else {
                            cultureSelector = SDL.jQuery.trim(parts[1]);
                            if (cultureSelector.indexOf("q=") === 0) {
                                cultureSelector = cultureSelector.substr(2);
                                pri = parseFloat(cultureSelector);
                                pri = isNaN(pri) ? 0 : pri;
                            } else {
                                pri = 1;
                            }
                        }
                        prioritized.push({ lang: lang, pri: pri });
                    }
                    prioritized.sort(function (a, b) {
                        if (a.pri < b.pri) {
                            return 1;
                        } else if (a.pri > b.pri) {
                            return -1;
                        }
                        return 0;
                    });

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        match = cultures[lang];
                        if (match && (!skipCount || !skipCount--)) {
                            return match;
                        }
                    }

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        do {
                            var index = lang.lastIndexOf("-");
                            if (index === -1) {
                                break;
                            }

                            // strip off the last part. e.g. en-US => en
                            lang = lang.substr(0, index);
                            match = cultures[lang];
                            if (match && (!skipCount || !skipCount--)) {
                                return match;
                            }
                        } while(1);
                    }

                    for (i = 0; i < l; i++) {
                        lang = prioritized[i].lang;
                        for (var cultureKey in cultures) {
                            var culture = cultures[cultureKey];
                            if (culture.language === lang && (!skipCount || !skipCount--)) {
                                return culture;
                            }
                        }
                    }
                } else if (SDL.Client.Type.isObject(names)) {
                    if (!skipCount) {
                        return names;
                    } else {
                        return this.findClosestCulture((names).name, skipCount);
                    }
                }
            }
            return !skipCount ? this._globalize.cultures["default"] : null;
        };

        GlobalizeClass.prototype.format = function (value, format, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.format.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.localize = function (key, parameters, cultureSelector) {
            if (key) {
                if (!this._globalize)
                    throw "SDL.Globalize is not initialized.";

                if (!cultureSelector && parameters && !SDL.Client.Type.isArray(parameters)) {
                    cultureSelector = parameters;
                    parameters = null;
                }

                var ckipCount = 0;
                var culture;
                var message;
                do {
                    culture = this.findClosestCulture(cultureSelector, ckipCount++);
                    if (culture) {
                        message = culture.messages[key];
                        if (message != null) {
                            if (SDL.Client.Type.isArray(parameters)) {
                                message = SDL.Client.Types.String.format(message, parameters);
                            }
                            return message;
                        }
                    }
                } while(culture);
            }
        };

        GlobalizeClass.prototype.parseDate = function (value, formats, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseDate.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.parseInt = function (value, radix, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseInt.apply(this._globalize, arguments);
        };

        GlobalizeClass.prototype.parseFloat = function (value, radix, cultureSelector) {
            if (!this._globalize)
                throw "SDL.Globalize is not initialized.";
            return this._globalize.parseFloat.apply(this._globalize, arguments);
        };
        return GlobalizeClass;
    })(SDL.Client.Types.ObjectWithEvents);
    SDL.GlobalizeClass = GlobalizeClass;
    SDL.Client.Types.OO.createInterface("SDL.GlobalizeClass", GlobalizeClass);
})(SDL || (SDL = {}));

var SDL;
(function (SDL) {
    SDL.Globalize = new SDL.GlobalizeClass();
})(SDL || (SDL = {}));
//@ sourceMappingURL=SDL.Globalize.js.map
