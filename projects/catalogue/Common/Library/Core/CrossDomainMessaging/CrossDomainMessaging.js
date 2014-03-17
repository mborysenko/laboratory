/// <reference path="../Types/Url1.ts" />
var SDL;
(function (SDL) {
    (function (Client) {
        /**
        *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
        **/
        (function (CrossDomainMessaging) {
            var reqId = new Date().getTime();
            var callbacks = {};
            var trustedDomains = [SDL.Client.Types.Url.getDomain(window.location.href)];
            var allowedHandlerBases;
            var parentXdm = undefined;

            function addTrustedDomain(url) {
                if (trustedDomains[0] != "*") {
                    if (url == "*") {
                        trustedDomains = ["*"];
                    } else {
                        for (var i = 0, len = trustedDomains.length; i < len; i++) {
                            if (SDL.Client.Types.Url.isSameDomain(trustedDomains[i], url)) {
                                return;
                            }
                        }
                        trustedDomains.push(url);
                    }
                }
            }
            CrossDomainMessaging.addTrustedDomain = addTrustedDomain;

            function clearTrustedDomains() {
                trustedDomains = [];
            }
            CrossDomainMessaging.clearTrustedDomains = clearTrustedDomains;

            function addAllowedHandlerBase(handler) {
                if (!allowedHandlerBases) {
                    allowedHandlerBases = [handler];
                } else {
                    allowedHandlerBases.push(handler);
                }
            }
            CrossDomainMessaging.addAllowedHandlerBase = addAllowedHandlerBase;

            function call(target, method, args, callback) {
                if (args) {
                    for (var i = 0, len = args.length; i < len; i++) {
                        if (typeof (args[i]) == "function") {
                            var callbackId = (++reqId);
                            callbacks[callbackId.toString()] = args[i];
                            args[i] = {
                                __callbackId: callbackId
                            };
                        }
                    }
                }

                var obj = {
                    method: method,
                    args: args
                };

                if (callback) {
                    obj.reqId = (++reqId);
                    callbacks[obj.reqId.toString()] = callback;
                }

                _postMessage(target, obj);
            }
            CrossDomainMessaging.call = call;
            function executeMessage(message, source, origin) {
                if (message) {
                    var execute;
                    if (message.method) {
                        var parts = message.method.split(".");
                        var lastIdx = parts.length - 1;
                        var base = window;
                        for (var i = 0; (i < lastIdx) && base; i++) {
                            base = base[parts[i]];
                        }

                        if (!base) {
                            throw Error("XDM: Unable to evaluate " + message.method);
                        } else if (!base[parts[lastIdx]]) {
                            throw Error("XDM: Unable to evaluate " + message.method + ". Method '" + parts[lastIdx] + "' is not defined.");
                        } else if (!allowedHandlerBases || allowedHandlerBases.indexOf(base) == -1) {
                            throw Error("XDM: Access denied to " + message.method);
                        } else {
                            var result;
                            var args = message.args;

                            if (args) {
                                for (var i = 0, len = args.length; i < len; i++) {
                                    if (args[i] && args[i].__callbackId) {
                                        args[i] = _createCallback(source, origin, args[i].__callbackId);
                                    }
                                }

                                execute = function () {
                                    return base[parts[lastIdx]].apply(base, message.args);
                                };
                            } else {
                                execute = function () {
                                    return base[parts[lastIdx]]();
                                };
                            }

                            execute.sourceWindow = source;
                            execute.sourceDomain = SDL.Client.Types.Url.getDomain(origin);

                            result = execute();

                            if (message.reqId) {
                                _postMessage(source, {
                                    respId: message.reqId,
                                    args: [result] }, origin);
                            }
                        }
                    } else if (message.respId) {
                        var callback = callbacks[message.respId.toString()];
                        if (callback) {
                            if (message.retire != false) {
                                delete callbacks[message.respId.toString()];
                            }
                            if (message.execute != false) {
                                execute = function () {
                                    callback.apply(window, message.args || []);
                                };
                                execute.sourceWindow = source;
                                execute.sourceDomain = SDL.Client.Types.Url.getDomain(origin);
                                execute();
                            }
                        }
                    }
                }
            }
            CrossDomainMessaging.executeMessage = executeMessage;

            function _postMessage(target, message, origin) {
                if (!origin) {
                    origin = trustedDomains.length == 1 ? trustedDomains[0] : "*";
                }

                var remoteXdm;

                if (origin == "*") {
                    if (target == window.parent) {
                        if (parentXdm === undefined) {
                            try  {
                                parentXdm = target.SDL.Client.CrossDomainMessaging;
                            } catch (err) {
                                parentXdm = null;
                            }
                        }

                        remoteXdm = parentXdm;
                    }
                } else if (SDL.Client.Types.Url.isSameDomain(origin, window.location.href)) {
                    try  {
                        remoteXdm = target.SDL.Client.CrossDomainMessaging;
                    } catch (err) {
                    }
                }

                if (remoteXdm) {
                    remoteXdm.executeMessage(message, window, window.location.href);
                } else {
                    target.postMessage("sdl:" + window.JSON.stringify(message), origin);
                }
            }

            function _createCallback(target, domain, callbackId) {
                var fnc = function () {
                    _postMessage(target, {
                        respId: callbackId,
                        retire: !fnc.reoccuring,
                        args: [].slice.call(arguments) }, domain);
                };
                fnc.retire = function () {
                    _postMessage(target, {
                        respId: callbackId,
                        execute: false,
                        retire: true }, domain);
                };
                return fnc;
            }

            function _messageHandler(e) {
                if (e && e.data && e.data.length > 4 && e.data.indexOf("sdl:") == 0) {
                    var allowed = trustedDomains[0] == "*";
                    if (!allowed) {
                        for (var i = 0, len = trustedDomains.length; i < len; i++) {
                            if (SDL.Client.Types.Url.isSameDomain(trustedDomains[i], e.origin)) {
                                allowed = true;
                                break;
                            }
                        }
                    }

                    if (allowed) {
                        executeMessage(window.JSON.parse(e.data.slice(4)), e.source, e.origin);
                    }
                }
            }

            window.addEventListener("message", _messageHandler);
        })(Client.CrossDomainMessaging || (Client.CrossDomainMessaging = {}));
        var CrossDomainMessaging = Client.CrossDomainMessaging;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=CrossDomainMessaging.js.map
