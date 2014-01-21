var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (Client) {
        (function (UI) {
            (function (ApplicationHost) {
                /// <reference path="..\..\ViewModels\Navigation.ts" />
                /// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.Core\Types\Object.d.ts" />
                /// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.UI.Core\Views\ViewBase.d.ts" />
                /// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.UI.Core.Knockout\ViewModels\ViewModelBase.d.ts" />
                (function (Views) {
                    var Navigation = SDL.Client.UI.ApplicationHost.ViewModels.Navigation;

                    eval(SDL.Client.Types.OO.enableCustomInheritance);
                    var Frame = (function (_super) {
                        __extends(Frame, _super);
                        function Frame() {
                            _super.apply(this, arguments);
                            this.initialized = ko.observable(false);
                        }
                        Frame.prototype.getRenderOptions = function () {
                            var _this = this;
                            var model = this.model = new SDL.UI.Core.Knockout.ViewModels.ViewModelBase();

                            model.initialized = this.initialized;
                            model.visitedNavigationGroups = ko.observableArray([]);
                            model.toggleNavigationPane = function () {
                                model.navigationPaneShown(!model.navigationPaneShown());
                            };

                            model.selectNavigationItem = function (item) {
                                Navigation.selectNavigationItem(item);
                            };

                            model.selectNavigationGroup = function (group) {
                                Navigation.currentNavigationGroup(group);
                            };

                            model.toggleExpandNavigationGroup = function (group) {
                                if (model.expandedNavigationGroup() != group) {
                                    model.expandedNavigationGroup(group);
                                } else {
                                    var groupsCount = 0;
                                    for (var i = 0, len = model.navigationGroups.length; i < len; i++) {
                                        var group = model.navigationGroups[i];
                                        if (group.shownItems()) {
                                            if (groupsCount) {
                                                model.expandedNavigationGroup(null);
                                                return;
                                            }
                                            groupsCount++;
                                        }
                                    }
                                }
                            };

                            model.blurredNavigationPane = function () {
                                if (model.navigationPaneShown()) {
                                    var currentNavigationItem = Navigation.currentNavigationItem();
                                    if (currentNavigationItem ? (currentNavigationItem.type != "home" || currentNavigationItem.navigationGroup.authenticationTargetDisplay && currentNavigationItem.navigationGroup.authenticationTargetDisplay()) : Navigation.currentNavigationGroup() != null) {
                                        model.navigationPaneShown(false);
                                    }
                                }
                            };

                            model.setTargetDisplayLocation = function (targetDisplay, node) {
                                if (targetDisplay.navigationItem) {
                                    var item = targetDisplay.navigationItem();
                                    var src = (!item || item.hidden()) ? "about:blank" : item.src();
                                    if (targetDisplay.src != src) {
                                        var frame = SDL.jQuery(node).prev("div").find("iframe")[0];
                                        if (src != "about:blank") {
                                            var urlChange = Client.Types.Url.makeRelativeUrl(targetDisplay.src, src);
                                            if (urlChange && urlChange.charAt(0) != "#") {
                                                // change is more than just a hash
                                                targetDisplay.loaded(false);
                                            }
                                        }

                                        try  {
                                            frame.contentWindow.location.replace(src);
                                        } catch (err) {
                                            frame.src = src;
                                        }
                                        targetDisplay.src = src;
                                    }
                                }
                            };

                            model.animateLoadingFeedback = function (element) {
                                if (element.style.animation == undefined && (element.style).webkitAnimation == undefined) {
                                    var position = 0;
                                    var step = 12;
                                    var interval = window.setInterval(function () {
                                        position += step;
                                        if (position >= 360) {
                                            position -= 360;
                                        }
                                        element.style.msTransform = "rotate(" + position + "deg)";
                                    }, 30);

                                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                        window.clearInterval(interval);
                                    });
                                }
                            };

                            model.initCustomScroll = function (customScrollWrapper) {
                                var barBtnHeight = 17;
                                var $customScrollWrapper = SDL.jQuery(customScrollWrapper);
                                var $navigationPane = $customScrollWrapper.parent(".frame-navigation-middle").parent(".frame-navigation-pane");
                                var $realScrollArea = $customScrollWrapper.prev(".frame-navigation-middle-scroll");
                                var realScrollContent = $realScrollArea.children("ul")[0];
                                var customScrollHandle = $customScrollWrapper.children(".frame-navigation-scroll-handle")[0];
                                var $customScrollArea = $customScrollWrapper.children(".frame-navigation-scroll");
                                var customScrollArea = $customScrollArea[0];
                                var customScrollContent = $customScrollArea.children(".frame-navigation-scroll-content")[0];
                                var customScrollAreaOffsetHeight;
                                var handleSpaceCorrection = 0;

                                // handleSpaceCorrection stores the difference between the calculated size and the actual size
                                var scrollShown = true;

                                function adjustHeight() {
                                    if (customScrollContent.offsetHeight != realScrollContent.offsetHeight || customScrollArea.offsetHeight != customScrollAreaOffsetHeight) {
                                        customScrollAreaOffsetHeight = customScrollArea.offsetHeight;
                                        if (customScrollContent.offsetHeight != realScrollContent.offsetHeight) {
                                            customScrollContent.style.height = realScrollContent.offsetHeight + "px";
                                        }

                                        var ratio = customScrollAreaOffsetHeight / realScrollContent.offsetHeight;

                                        if (ratio >= 1) {
                                            if (scrollShown) {
                                                scrollShown = false;
                                                $customScrollWrapper.addClass("frame-navigation-scroll-wrapper-hidden");
                                            }
                                        } else {
                                            if (!scrollShown) {
                                                scrollShown = true;
                                                $customScrollWrapper.removeClass("frame-navigation-scroll-wrapper-hidden");
                                            }

                                            var height = (customScrollAreaOffsetHeight - barBtnHeight * 2) * ratio;
                                            if (height < 10) {
                                                handleSpaceCorrection = 10 - height;
                                                height = 10;
                                            }

                                            if (customScrollHandle.offsetHeight != height) {
                                                customScrollHandle.style.height = height + "px";
                                            }

                                            onRealScroll();
                                            onCustomScroll();
                                        }
                                    }
                                }
                                ;
                                adjustHeight();
                                _this.scrollHeightMonitorInterval = setInterval(adjustHeight, 100);

                                function onCustomScroll() {
                                    if (scrollShown) {
                                        customScrollHandle.style.top = (customScrollArea.offsetHeight - barBtnHeight * 2 - handleSpaceCorrection) * customScrollArea.scrollTop / customScrollContent.offsetHeight + barBtnHeight + "px";
                                        if ($realScrollArea.scrollTop() != $customScrollArea.scrollTop()) {
                                            $realScrollArea.scrollTop($customScrollArea.scrollTop());
                                        }
                                    }
                                }
                                ;
                                onCustomScroll();
                                $customScrollArea.scroll(onCustomScroll);

                                function onRealScroll() {
                                    if (scrollShown) {
                                        if ($customScrollArea.scrollTop() != $realScrollArea.scrollTop()) {
                                            $customScrollArea.scrollTop($realScrollArea.scrollTop());
                                        }
                                    }
                                }

                                $realScrollArea.scroll(onRealScroll);
                                $navigationPane.scroll(function () {
                                    $navigationPane.scrollLeft(0);
                                });
                            };

                            var getTranslation = function (translations, fallbackTranslations) {
                                if (translations || fallbackTranslations) {
                                    var culture = model.culture();
                                    if (culture) {
                                        if (translations && translations[culture]) {
                                            return translations[culture];
                                        }
                                        if (fallbackTranslations && fallbackTranslations[culture]) {
                                            return fallbackTranslations[culture];
                                        }

                                        if (culture.indexOf("-") != -1) {
                                            culture = culture.replace(/\-.*$/, "");
                                            if (translations && translations[culture]) {
                                                return translations[culture];
                                            }
                                            if (fallbackTranslations && fallbackTranslations[culture]) {
                                                return fallbackTranslations[culture];
                                            }
                                        }
                                    }
                                }
                            };

                            model.getNavigationItemName = function (item) {
                                if (item == Navigation.homeNavigationItem) {
                                    return model.localize("apphost.home");
                                } else {
                                    var name = getTranslation(item.translations, item.applicationEntryPoint && item.applicationEntryPoint.translations) || (item.titleResource && model.localize(item.titleResource)) || item.title;
                                    if (name) {
                                        return name;
                                    }

                                    switch (item.type) {
                                        case "home":
                                            return model.localize("apphost.home");
                                        case "activities":
                                            return model.localize("apphost.activities");
                                        case "settings":
                                            return model.localize("apphost.settings");
                                        case "help":
                                            return model.localize("apphost.help");
                                        case "about":
                                            return model.localize("apphost.about");
                                        default:
                                            return item.id;
                                    }
                                }
                            };

                            model.getNavigationGroupName = function (group) {
                                return getTranslation(group.translations, group.applicationEntryPointGroup && group.applicationEntryPointGroup.translations) || group.title || group.id;
                            };

                            model.registerTargetDisplayFrame = function (targetDisplay, frame) {
                                targetDisplay.targetDisplay.frame = frame;
                            };

                            Navigation.initialize(function () {
                                var currentItem = Navigation.currentNavigationItem();
                                model.navigationPaneShown = ko.observable(currentItem ? (currentItem.type == "home" && !currentItem.navigationGroup.authenticationTargetDisplay) : !Navigation.currentNavigationGroup());
                                model.navigationGroups = Navigation.navigationGroups;
                                model.currentNavigationItem = Navigation.currentNavigationItem;
                                model.currentNavigationGroup = Navigation.currentNavigationGroup;
                                model.navigationItemTargetDisplays = Navigation.navigationItemTargetDisplays;
                                model.authenticationTargetDisplays = Navigation.authenticationTargetDisplays;
                                model.topNavigationGroup = Navigation.topNavigationGroup;
                                model.homeNavigationItem = Navigation.homeNavigationItem;

                                model.navigationPaneToggleShown = ko.computed(function () {
                                    var currentGroup;
                                    var currentItem = model.currentNavigationItem();
                                    if (currentItem) {
                                        currentGroup = currentItem.navigationGroup;
                                    } else {
                                        currentGroup = model.currentNavigationGroup();
                                    }

                                    if (currentGroup && currentGroup.authenticationTargetDisplay) {
                                        var authTargetDisplay = currentGroup.authenticationTargetDisplay();
                                        if (authTargetDisplay) {
                                            var applicationToAuthenticate = authTargetDisplay.targetDisplay.application;
                                            var visitedNavigationGroups = model.visitedNavigationGroups();
                                            for (var i = 0, len = visitedNavigationGroups.length; i < len; i++) {
                                                var group = visitedNavigationGroups[i];
                                                if (group != currentGroup && (!group.authenticationTargetDisplay || !group.authenticationTargetDisplay() || SDL.jQuery.inArray(applicationToAuthenticate, group.applications) == -1)) {
                                                    // a group exists that is not blocked by current app's authentication screen
                                                    return true;
                                                }
                                            }

                                            // there are no other navigation groups that have been accesssed -> hide the toggle button
                                            return false;
                                        }
                                    }
                                    return true;
                                });

                                model.expandedNavigationGroup = ko.observable((function () {
                                    var groupsCount = 0;
                                    var singleGroupToExpand;
                                    for (var i = 0, len = model.navigationGroups.length; i < len; i++) {
                                        var group = model.navigationGroups[i];
                                        if (group.shownItems()) {
                                            if (groupsCount) {
                                                return null;
                                            }
                                            singleGroupToExpand = group;
                                            groupsCount++;
                                        }
                                    }
                                    return singleGroupToExpand;
                                })());

                                model.onNavigationSelectionChanged = ko.computed(function () {
                                    var currentNavigationItem = Navigation.currentNavigationItem();
                                    var currentNavigationGroup = Navigation.currentNavigationGroup();
                                    if (currentNavigationItem) {
                                        currentNavigationGroup = currentNavigationItem.navigationGroup;
                                        model.navigationPaneShown(currentNavigationItem.type == "home" && (!currentNavigationGroup.authenticationTargetDisplay || !currentNavigationGroup.authenticationTargetDisplay()));

                                        if (currentNavigationGroup != Navigation.topNavigationGroup) {
                                            model.expandedNavigationGroup(currentNavigationGroup);
                                        }
                                    } else if (currentNavigationGroup) {
                                        model.navigationPaneShown(false);
                                        model.expandedNavigationGroup(currentNavigationGroup);
                                    } else {
                                        model.navigationPaneShown(true);
                                    }

                                    if (currentNavigationGroup && model.visitedNavigationGroups.indexOf(currentNavigationGroup) == -1) {
                                        model.visitedNavigationGroups.push(currentNavigationGroup);
                                    }
                                });

                                model.onExpandedNavigationGroupChanged = model.expandedNavigationGroup.subscribe(function () {
                                    var navGroup = model.expandedNavigationGroup();
                                    if (navGroup) {
                                        var targetDisplay = navGroup.authenticationTargetDisplay && navGroup.authenticationTargetDisplay();
                                        if (targetDisplay && targetDisplay.authenticationMode == "on-access" && targetDisplay.navigationGroup() != navGroup) {
                                            targetDisplay.navigationGroup(navGroup);
                                            targetDisplay.accessed(true);
                                        }
                                    }
                                });

                                model.shownTargetDisplay = ko.computed(function () {
                                    var navigationItem = Navigation.currentNavigationItem();
                                    if (navigationItem) {
                                        return (navigationItem.navigationGroup && navigationItem.navigationGroup.authenticationTargetDisplay && navigationItem.navigationGroup.authenticationTargetDisplay()) || (!navigationItem.hidden() && navigationItem.targetDisplay);
                                    } else {
                                        var navigationGroup = Navigation.currentNavigationGroup();
                                        if (navigationGroup) {
                                            return navigationGroup.authenticationTargetDisplay();
                                        }
                                    }
                                });

                                _this.setInitialized();
                            });

                            return model;
                        };

                        Frame.prototype.setInitialized = function () {
                            var _this = this;
                            this.updateTitleBar = ko.computed(function () {
                                var currentNavigationItem = Navigation.currentNavigationItem();
                                if (!currentNavigationItem) {
                                    window.document.title = _this.model.localize("apphost.apptitle");
                                } else {
                                    window.document.title = _this.model.localize("apphost.apptitle") + " - " + _this.model.getNavigationItemName(currentNavigationItem);
                                }
                            });

                            this.initialized(true);
                        };
                        return Frame;
                    })(SDL.UI.Core.Views.ViewBase);
                    Views.Frame = Frame;

                    Frame.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Frame$Views$Frame$disposeInterface() {
                        if (this.scrollHeightMonitorInterval) {
                            window.clearInterval(this.scrollHeightMonitorInterval);
                            this.scrollHeightMonitorInterval = null;
                        }
                        if (this.updateTitleBar) {
                            (this.updateTitleBar).dispose();
                            this.updateTitleBar = null;
                        }

                        if (this.model) {
                            var model = this.model;
                            if (model.shownTargetDisplay) {
                                model.shownTargetDisplay.dispose();
                                model.shownTargetDisplay = null;
                            }
                            if (model.onNavigationSelectionChanged) {
                                model.onNavigationSelectionChanged.dispose();
                                model.onNavigationSelectionChanged = null;
                            }
                            if (model.onExpandedNavigationGroupChanged) {
                                model.onExpandedNavigationGroupChanged.dispose();
                                model.onExpandedNavigationGroupChanged = null;
                            }
                            if (model.navigationPaneToggleShown) {
                                model.navigationPaneToggleShown.dispose();
                                model.navigationPaneToggleShown = null;
                            }

                            model.dispose();
                            this.model = null;
                        }
                    });

                    SDL.Client.Types.OO.createInterface("SDL.Client.UI.ApplicationHost.Views.Frame", Frame);
                })(ApplicationHost.Views || (ApplicationHost.Views = {}));
                var Views = ApplicationHost.Views;
            })(UI.ApplicationHost || (UI.ApplicationHost = {}));
            var ApplicationHost = UI.ApplicationHost;
        })(Client.UI || (Client.UI = {}));
        var UI = Client.UI;
    })(SDL.Client || (SDL.Client = {}));
    var Client = SDL.Client;
})(SDL || (SDL = {}));
//# sourceMappingURL=Frame.js.map
