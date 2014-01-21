var SDL;
(function (SDL) {
    (function (Client) {
        /// <reference path="Application.ts" />
        /**
        *	implemented in SDL.Client.HostedApplication, copied to SDL.Client.Core
        **/
        (function (Application) {
            Application.ApplicationFacade = {};
            Application.isApplicationFacadeSecure = undefined;

            (function (ApplicationFacadeStub) {
                function callApplicationFacade(method, arguments, caller) {
                    if (!Client.Application.isHosted) {
                        throw Error("Attempt to call Application facade failed: application is not hosted.");
                    } else if (!Application.ApplicationFacade[method]) {
                        throw Error("Attempt to call Application facade failed: method '" + method + "' is not defined.");
                    } else if (Application.isApplicationFacadeSecure == undefined) {
                        throw Error("Attempt to call Application facade failed: unable to determine security level of the Application facade.");
                    } else {
                        if (Application.isApplicationFacadeSecure) {
                            if (!Client.Application.ApplicationHost.isTrusted) {
                                throw Error("Attempt to call secured Application facade failed: appliction host is untrusted.");
                            } else if (!caller.applicationId || !caller.applicationDomain) {
                                throw Error("Attempt to call secured Application facade failed: unable to determine the caller.");
                            } else if (caller.applicationId != Client.Application.applicationSuiteId || !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain)) {
                                if (!Client.Application.trustedApplications && !Client.Application.trustedApplicationDomains) {
                                    throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationId + ", " + caller.applicationDomain + ")");
                                } else {
                                    var allowed;
                                    var i, len;
                                    if (Client.Application.trustedApplications && caller.applicationId != Client.Application.applicationSuiteId && Application.trustedApplications.indexOf(caller.applicationId) == -1) {
                                        throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationId + ")");
                                    }

                                    if (Client.Application.trustedApplicationDomains && !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain) && !Client.Types.Url.isSameDomain(window.location.href, caller.applicationDomain)) {
                                        allowed = false;
                                        for (i = 0, len = Application.trustedApplicationDomains.length; i < len; i++) {
                                            if (Client.Types.Url.isSameDomain(Application.trustedApplicationDomains[i], caller.applicationDomain)) {
                                                allowed = true;
                                                break;
                                            }
                                        }

                                        if (!allowed) {
                                            throw Error("Attempt to call secured Application facade failed: caller untrusted (" + caller.applicationDomain + ")");
                                        }
                                    }
                                }
                            }
                        }

                        var execute = function (args) {
                            return Application.ApplicationFacade[method].apply(Application.ApplicationFacade, args);
                        };
                        execute.applicationDomain = caller.applicationDomain;
                        execute.applicationId = caller.applicationId;
                        return execute(arguments || []);
                    }
                }
                ApplicationFacadeStub.callApplicationFacade = callApplicationFacade;
            })(Application.ApplicationFacadeStub || (Application.ApplicationFacadeStub = {}));
            var ApplicationFacadeStub = Application.ApplicationFacadeStub;
        })(Client.Application || (Client.Application = {}));
        var Application = Client.Application;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=ApplicationFacade.js.map
