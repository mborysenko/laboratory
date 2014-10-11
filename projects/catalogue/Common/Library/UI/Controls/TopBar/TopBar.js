﻿/// <reference path="../../SDL.Client.Core/Libraries/Globalize/SDL.Globalize.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../ScrollView/ScrollView.jQuery.ts" />
/// <reference path="../Callout/Callout.jQuery.ts" />
/// <reference path="../ResizeTrigger/ResizeTrigger.jQuery.ts" />
/// <reference path="../Tooltip/Tooltip.jQuery.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SDL;
(function (SDL) {
    (function (UI) {
        (function (Controls) {
            (function (TopBarButton) {
                TopBarButton[TopBarButton["MESSAGES"] = "messages"] = "MESSAGES";
                TopBarButton[TopBarButton["WORKFLOWS"] = "workflows"] = "WORKFLOWS";
                TopBarButton[TopBarButton["NOTIFICATIONS"] = "notifications"] = "NOTIFICATIONS";
                TopBarButton[TopBarButton["USER"] = "user"] = "USER";
                TopBarButton[TopBarButton["SEARCH"] = "search"] = "SEARCH";
                TopBarButton[TopBarButton["HELP"] = "help"] = "HELP";
                TopBarButton[TopBarButton["CLOSE"] = "close"] = "CLOSE";
            })(Controls.TopBarButton || (Controls.TopBarButton = {}));
            var TopBarButton = Controls.TopBarButton;

            // buttonIDs array defines the order and the gruping of the buttons in the top bar
            var buttonIDs = [
                [TopBarButton.SEARCH, TopBarButton.HELP],
                [TopBarButton.MESSAGES, TopBarButton.WORKFLOWS, TopBarButton.NOTIFICATIONS, TopBarButton.USER],
                [TopBarButton.CLOSE]];

            var buttonTooltipResources = {
                messages: "controls.topbar.messages",
                workflows: "controls.topbar.workflows",
                notifications: "controls.topbar.notifications",
                search: "controls.topbar.search",
                help: "controls.topbar.help",
                close: "controls.topbar.close",
                logIn: "controls.topbar.logIn"
            };

            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var TopBar = (function (_super) {
                __extends(TopBar, _super);
                function TopBar(element, options) {
                    _super.call(this, element, options);
                }
                TopBar.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = p.$element = SDL.jQuery(p.element);

                    var options = p.options = SDL.jQuery.extend(true, { ribbonTabs: [], buttons: {} }, p.options);

                    options.hostMode = options.hostMode && options.hostMode.toString() == "true" || false;

                    if (options.ribbonTabs && options.ribbonTabs.length) {
                        if (!this.hasRibbonTabId(options.selectedRibbonTabId)) {
                            options.selectedRibbonTabId = options.ribbonTabs[0].id;
                        }
                    } else {
                        options.ribbonTabs = [];
                        if (options.selectedRibbonTabId != null && !this.hasRibbonTabId(options.selectedRibbonTabId)) {
                            options.selectedRibbonTabId = null;
                        }
                    }

                    if (!options.buttons) {
                        options.buttons = {};
                    }

                    if (!options.hostMode) {
                        SDL.jQuery(document.documentElement).addClass("sdl-topbar-page");
                    }

                    $element.addClass("sdl-topbar");
                    p.$ribbonTabsContainer = SDL.jQuery("<div class='sdl-topbar-ribbon'><div class='sdl-topbar-resize-trigger'></div><span class='sdl-topbar-ribbon-overflown-button'></span></div>").appendTo($element).click(this.getDelegate(this.onRibbonTabClick));

                    p.$buttonsContainer = SDL.jQuery("<div class='sdl-topbar-buttons'></div>").appendTo($element).click(this.getDelegate(this.onButtonClick));

                    this.populateButtons();

                    SDL.Globalize.addEventListener("culturechange", this.getDelegate(this.updateButtons));

                    this.updateButtons();

                    p.$resizeTrigger = p.$ribbonTabsContainer.children(".sdl-topbar-resize-trigger");
                    p.$resizeTriggerControl = p.$resizeTrigger.resizeTrigger();

                    p.$tabsOverflowButton = p.$ribbonTabsContainer.children(".sdl-topbar-ribbon-overflown-button");

                    this.updateButtons();
                    this.populateRibbonTabs();
                    this.calculateRibbonTabs();

                    p.$resizeTriggerControl.resize(this.getDelegate(this.onRibbonTabsResize));

                    if (options.ribbonTabsFlyoutMenuShown && p.$ribbonTabsContainer.hasClass("sdl-topbar-ribbon-overflown")) {
                        this.showFlyoutMenu();
                    }
                };

                TopBar.prototype.update = function (options) {
                    var _this = this;
                    if (options) {
                        var p = this.properties;
                        var prevOptions = p.options;

                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        options = p.options = SDL.jQuery.extend(true, {}, p.options);

                        options.hostMode = options.hostMode && options.hostMode.toString() == "true" || false;

                        var changedProperties = [];

                        if (options.hostMode != prevOptions.hostMode) {
                            if (options.hostMode) {
                                SDL.jQuery(document.documentElement).removeClass("sdl-topbar-page");
                            } else {
                                SDL.jQuery(document.documentElement).addClass("sdl-topbar-page");
                            }
                            changedProperties.push("hostMode");
                        }

                        if (options.ribbonTabs) {
                            // if needed, compare ribbonTabs and raise an event when changed
                        } else {
                            options.ribbonTabs = prevOptions.ribbonTabs;
                        }

                        if (!options.buttons) {
                            options.buttons = prevOptions.buttons;
                        }

                        if (options.ribbonTabs.length) {
                            if (!this.hasRibbonTabId(options.selectedRibbonTabId)) {
                                options.selectedRibbonTabId = options.ribbonTabs[0].id;
                            }
                        } else if (options.selectedRibbonTabId != null && !this.hasRibbonTabId(options.selectedRibbonTabId)) {
                            options.selectedRibbonTabId = null;
                        }

                        if (options.selectedRibbonTabId != prevOptions.selectedRibbonTabId) {
                            changedProperties.push("selectedRibbonTabId");
                        }

                        this.updateButtons();
                        this.populateRibbonTabs();
                        this.calculateRibbonTabs();

                        if (options.ribbonTabsFlyoutMenuShown != null) {
                            options.ribbonTabsFlyoutMenuShown = options.ribbonTabsFlyoutMenuShown && options.ribbonTabsFlyoutMenuShown.toString() == "true" || false;
                            if (options.ribbonTabsFlyoutMenuShown) {
                                if (p.$ribbonTabsContainer.hasClass("sdl-topbar-ribbon-overflown")) {
                                    this.showFlyoutMenu();
                                }
                            } else {
                                this.hideFlyoutMenu();
                            }
                        }

                        for (var i = 0, len = changedProperties.length; i < len; i++) {
                            this.fireEvent("propertychange", { property: changedProperties[i], value: options[changedProperties[i]] });
                            switch (changedProperties[i]) {
                                case "selectedRibbonTabId":
                                    this.fireEvent("ribbonselectionchange", { id: options.selectedRibbonTabId });
                                    break;
                            }
                        }

                        if (options.buttons != prevOptions.buttons) {
                            buttonIDs.forEach(function (buttonGroup, index) {
                                buttonGroup.forEach(function (buttonId, index) {
                                    var buttonOptions = options.buttons[buttonId];
                                    var buttonHidden = !buttonOptions || buttonOptions.toString() == "false" || (buttonOptions.hidden && buttonOptions.hidden.toString() == "true") || false;
                                    var buttonSelected = buttonOptions && buttonOptions.selected && buttonOptions.selected.toString() == "true" || false;

                                    var prevButtonOptions = prevOptions.buttons[buttonId];
                                    var prevButtonHidden = !prevButtonOptions || prevButtonOptions.toString() == "false" || (prevButtonOptions.hidden && prevButtonOptions.hidden.toString() == "true") || false;
                                    var prevButtonSelected = prevButtonOptions && prevButtonOptions.selected && prevButtonOptions.selected.toString() == "true" || false;

                                    if (buttonHidden != prevButtonHidden) {
                                        _this.fireEvent("propertychange", { property: "buttons." + buttonId + ".hidden", value: buttonHidden });
                                        if (buttonHidden) {
                                            _this.fireEvent("hidebutton", { button: buttonId });
                                        } else {
                                            _this.fireEvent("showbutton", { button: buttonId });
                                        }
                                    }

                                    if (buttonSelected != prevButtonSelected) {
                                        if (buttonSelected) {
                                            var $button = p.$buttonsContainer.find(".sdl-topbar-button-" + buttonId);
                                            var buttonPosition = _this.getButtonPosition($button);
                                            _this.fireEvent("propertychange", { property: "buttons." + buttonId + ".position.left", value: buttonPosition.left });
                                            _this.fireEvent("propertychange", { property: "buttons." + buttonId + ".position.right", value: buttonPosition.right });
                                            _this.fireEvent("positionbutton", { button: buttonId, position: buttonPosition });
                                            _this.fireEvent("propertychange", { property: "buttons." + buttonId + ".selected", value: true });
                                            _this.fireEvent("selectbutton", { button: buttonId });
                                        } else {
                                            _this.fireEvent("propertychange", { property: "buttons." + buttonId + ".selected", value: false });
                                            _this.fireEvent("unselectbutton", { button: buttonId });
                                        }
                                    }
                                });
                            });
                        }
                    }
                };

                TopBar.prototype.hasRibbonTabId = function (id) {
                    var options = this.properties.options;
                    var found = false;
                    if (options.selectedRibbonTabId != null) {
                        SDL.jQuery.each(options.ribbonTabs, function (index, ribbonTab) {
                            if (ribbonTab.id == options.selectedRibbonTabId) {
                                found = true;
                                return false;
                            }
                        });
                    }
                    return found;
                };

                TopBar.prototype.populateRibbonTabs = function () {
                    var p = this.properties;
                    var $ribbonTabs = this.getRibbonTabs();
                    var $ribbonTabsLength = $ribbonTabs.length;
                    var ribbonTabs = p.options.ribbonTabs;
                    var selectedTabId = p.options.selectedRibbonTabId;
                    var i;
                    var len = ribbonTabs.length;

                    for (i = 0; i < len; i++) {
                        var ribbonTabOptions = ribbonTabs[i];
                        var $ribbonTab;
                        var hidden = ribbonTabOptions.hidden && ribbonTabOptions.hidden.toString() == "true" || false;

                        $ribbonTab = $ribbonTabs.length > i ? $ribbonTabs.eq(i) : SDL.jQuery("<span></span>").insertBefore(p.$tabsOverflowButton);

                        $ribbonTab.data("tab-id", ribbonTabOptions.id).text(ribbonTabOptions.label || "_").toggleClass("sdl-topbar-ribbon-tab-hidden", hidden).toggleClass("sdl-topbar-ribbon-tab-selected", ribbonTabOptions.id == selectedTabId);
                    }

                    if ($ribbonTabs.length > len) {
                        $ribbonTabs.slice(len).remove();
                    }

                    this.updateFlyoutMenuList();
                };

                TopBar.prototype.populateButtons = function () {
                    var _this = this;
                    buttonIDs.forEach(function (buttonGroup, index) {
                        var $buttonsGroup = SDL.jQuery("<span></span>").appendTo(_this.properties.$buttonsContainer);

                        buttonGroup.forEach(function (buttonId, index) {
                            var $button = SDL.jQuery("<span><span></span></span>").addClass("sdl-topbar-button-" + buttonId).appendTo($buttonsGroup);

                            switch (buttonId) {
                                case TopBarButton.MESSAGES:
                                case TopBarButton.WORKFLOWS:
                                case TopBarButton.NOTIFICATIONS:
                                    $button.append("<span class='sdl-topbar-bubble'></span>");
                                    break;
                            }
                            //$button.tooltip({ relativeTo: "element" });
                        });
                    });
                };

                TopBar.prototype.updateButtons = function () {
                    var p = this.properties;
                    var buttonsOptions = p.options.buttons;

                    buttonIDs.forEach(function (buttonGroup, index) {
                        var groupEmpty = true;
                        var $buttonsGroup = p.$buttonsContainer.children().eq(index);
                        buttonGroup.forEach(function (buttonId, index) {
                            var buttonOptions = buttonsOptions[buttonId];
                            var buttonHidden = !buttonOptions || buttonOptions.toString() == "false" || (buttonOptions.hidden && buttonOptions.hidden.toString() == "true") || false;
                            var buttonSelected = buttonOptions && buttonOptions.selected && buttonOptions.selected.toString() == "true" || false;

                            var $button = $buttonsGroup.children(".sdl-topbar-button-" + buttonId).toggleClass("sdl-topbar-button-hidden", buttonHidden).toggleClass("sdl-topbar-button-selected", buttonSelected);

                            if (!buttonHidden) {
                                switch (buttonId) {
                                    case TopBarButton.MESSAGES:
                                    case TopBarButton.WORKFLOWS:
                                    case TopBarButton.NOTIFICATIONS:
                                        var actualValue = (buttonOptions.value || 0) + "";
                                        var value = actualValue > 99 ? "99+" : ((actualValue | 0) == actualValue ? (actualValue.replace(/^0+/, "") || 0) : actualValue);
                                        $button.attr("title", SDL.Globalize.localize(buttonTooltipResources[buttonId])).children(":last-child").text(value).toggleClass("sdl-topbar-bubble-empty", value == "0");
                                        break;
                                    case TopBarButton.USER:
                                        var userButtonOptions = buttonOptions;
                                        var isLoggedIn = userButtonOptions.isLoggedIn && userButtonOptions.isLoggedIn.toString() == "true" || false;
                                        var isPicture = userButtonOptions.isPicture && userButtonOptions.isPicture.toString() == "true" || false;
                                        var hasPicture = !!userButtonOptions.pictureUrl;
                                        $button.attr("title", isLoggedIn ? (userButtonOptions.userName || null) : SDL.Globalize.localize(buttonTooltipResources.logIn)).toggleClass("sdl-topbar-button-userloggedin", !isPicture && isLoggedIn).toggleClass("sdl-topbar-button-userpicture", isPicture && hasPicture).toggleClass("sdl-topbar-button-userdefaultpicture", isPicture && !hasPicture).children(":first-child").css("background-image", isPicture && hasPicture ? "url(\"" + encodeURI(userButtonOptions.pictureUrl) + "\")" : "");
                                        break;
                                    default:
                                        $button.attr("title", SDL.Globalize.localize(buttonTooltipResources[buttonId]));
                                        break;
                                }
                            }

                            if (!buttonHidden && groupEmpty) {
                                groupEmpty = false;
                            }
                        });
                        $buttonsGroup.toggleClass("sdl-topbar-buttongroup-empty", groupEmpty);
                    });

                    p.$element.css("paddingRight", p.$buttonsContainer[0].offsetWidth + 30);
                };

                TopBar.prototype.onRibbonTabsResize = function () {
                    this.calculateRibbonTabs();
                };

                TopBar.prototype.calculateRibbonTabs = function () {
                    var p = this.properties;
                    var availableWidth = p.$ribbonTabsContainer[0].offsetWidth;
                    if (availableWidth < 10) {
                        // resized to something ridiculously small, don't bother to do calculations
                        this.hideFlyoutMenu();
                    } else {
                        var remainingAvailableWidth = p.$ribbonTabsContainer[0].offsetWidth;
                        var overflown = false;
                        var $ribbonTabs = this.getRibbonTabs();
                        $ribbonTabs.each(function (index, tab) {
                            if (!remainingAvailableWidth || (remainingAvailableWidth -= tab.offsetWidth) < 0) {
                                overflown = true;
                                return false;
                            }
                        });

                        if (overflown) {
                            availableWidth -= 31;

                            var $selectedTab = this.getSelectedRibbonTab();

                            // we'll try to keep the left position of the selected tab as it was
                            var alignRight = false;
                            if ($selectedTab.hasClass("sdl-topbar-ribbon-overflown-tab")) {
                                // unless the selected tab was out of screen
                                alignRight = true;
                                $selectedTab.removeClass("sdl-topbar-ribbon-overflown-tab");
                            }
                            remainingAvailableWidth = availableWidth - $selectedTab[0].offsetWidth;

                            // process all tabs currently in sight (to the left of the selected tab)
                            var $prevTab = $selectedTab.prev();
                            var hiding = false;

                            while ($prevTab.length && !$prevTab.is(p.$resizeTrigger) && (alignRight || !$prevTab.hasClass("sdl-topbar-ribbon-overflown-tab"))) {
                                if (hiding) {
                                    $prevTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                } else {
                                    var offsetWidth = $prevTab[0].offsetWidth;
                                    if (offsetWidth) {
                                        offsetWidth = offsetWidth + .5; // adding .5 as the actual size might be more than offsetWidth, which might sum up to something significant
                                    }

                                    if (remainingAvailableWidth >= offsetWidth) {
                                        remainingAvailableWidth -= offsetWidth;
                                        $prevTab.removeClass("sdl-topbar-ribbon-overflown-tab");
                                    } else {
                                        hiding = true;
                                        $prevTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                    }
                                }
                                $prevTab = $prevTab.prev();
                            }

                            // process all tabs to the right of the selected tab
                            var $nextTab = $selectedTab.next();
                            hiding = false;

                            while ($nextTab.length && !$nextTab.is(p.$tabsOverflowButton)) {
                                if (hiding) {
                                    $nextTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                } else {
                                    var offsetWidth = $nextTab[0].offsetWidth;
                                    if (offsetWidth) {
                                        offsetWidth = offsetWidth + .5; // adding .5 as the actual size might be more than offsetWidth, which might sum up to something significant
                                    }

                                    if (remainingAvailableWidth >= offsetWidth) {
                                        remainingAvailableWidth -= offsetWidth;
                                        $nextTab.removeClass("sdl-topbar-ribbon-overflown-tab");
                                    } else {
                                        hiding = true;
                                        $nextTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                    }
                                }
                                $nextTab = $nextTab.next();
                            }

                            if (remainingAvailableWidth >= 0) {
                                // process all remaining tabs to the left of the selected tab
                                hiding = false;

                                while ($prevTab.length && !$prevTab.is(p.$resizeTrigger)) {
                                    if (hiding) {
                                        $prevTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                    } else {
                                        var offsetWidth = $prevTab[0].offsetWidth;
                                        if (offsetWidth) {
                                            offsetWidth = offsetWidth + .5; // adding .5 as the actual size might be more than offsetWidth, which might sum up to something significant
                                        }

                                        if (remainingAvailableWidth >= offsetWidth) {
                                            remainingAvailableWidth -= offsetWidth;
                                            $prevTab.removeClass("sdl-topbar-ribbon-overflown-tab");
                                        } else {
                                            hiding = true;
                                            $prevTab.addClass("sdl-topbar-ribbon-overflown-tab");
                                        }
                                    }
                                    $prevTab = $prevTab.prev();
                                }
                            }
                            p.$ribbonTabsContainer.addClass("sdl-topbar-ribbon-overflown");
                            this.setFlyoutPosition();
                        } else {
                            $ribbonTabs.removeClass("sdl-topbar-ribbon-overflown-tab");
                            p.$ribbonTabsContainer.removeClass("sdl-topbar-ribbon-overflown");
                            this.hideFlyoutMenu();
                        }
                    }
                };

                TopBar.prototype.onRibbonTabClick = function (e) {
                    var p = this.properties;
                    if (e.target == p.$tabsOverflowButton[0]) {
                        if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                            this.hideFlyoutMenu();
                        } else {
                            this.showFlyoutMenu();
                        }
                    } else {
                        this.selectRibbonTabId(SDL.jQuery(e.target).data("tab-id"));
                    }
                };

                TopBar.prototype.onButtonClick = function (e) {
                    var p = this.properties;
                    if (p.$buttonsContainer[0].contains(e.target)) {
                        var $button = SDL.jQuery(e.target);
                        if ($button[0].className.indexOf("sdl-topbar-button") == -1) {
                            $button = $button.parent();
                        }

                        for (var i = 0, len = buttonIDs.length; i < len; i++) {
                            var buttonsGroup = buttonIDs[i];
                            for (var j = 0, lenj = buttonsGroup.length; j < lenj; j++) {
                                if ($button.hasClass("sdl-topbar-button-" + buttonsGroup[j])) {
                                    if (buttonsGroup[j] == TopBarButton.CLOSE) {
                                        this.fireEvent("clickbutton", { button: buttonsGroup[j] });
                                    } else {
                                        this.toggleButton(buttonsGroup[j]);
                                    }
                                    return;
                                }
                            }
                        }
                    }
                };

                TopBar.prototype.getRibbonTabIndexById = function (tabId) {
                    var index = -1;
                    this.getRibbonTabs().each(function (i, element) {
                        if (SDL.jQuery(element).data("tab-id") == tabId) {
                            index = i;
                            return false;
                        }
                    });
                    return index;
                };

                TopBar.prototype.getRibbonTabById = function (tabId) {
                    var $tab;
                    this.getRibbonTabs().each(function (i, element) {
                        if (SDL.jQuery(element).data("tab-id") == tabId) {
                            $tab = SDL.jQuery(element);
                            return false;
                        }
                    });
                    return $tab;
                };

                TopBar.prototype.showFlyoutMenu = function () {
                    var p = this.properties;
                    if (!p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        p.$tabsOverflowButton.addClass("sdl-topbar-ribbon-overflown-button-pressed");
                        if (!p.flyoutMenuElement) {
                            // create flyout menu element as a child of the body
                            var $flyoutMenu = SDL.jQuery("<div class='sdl-topbar-ribbon-flyout-menu'><div><div data-sdl-scrollview-child='true'></div></div></div>").appendTo(document.body);
                            p.flyoutMenuElement = $flyoutMenu[0];
                            p.flyoutMenuListElement = p.flyoutMenuElement.firstElementChild.firstElementChild;

                            SDL.jQuery(p.flyoutMenuListElement).mousedown(this.getDelegate(this.onFlyoutMouseDown)); // enable selecting items with mouse
                            $flyoutMenu.keydown(this.getDelegate(this.onFlyoutKeyDown)); // keyboard support in the flyout menu list

                            // create callout control
                            p.flyoutCallout = $flyoutMenu.callout({
                                targetElement: p.$tabsOverflowButton[0],
                                preferredPosition: [Controls.CalloutPosition.BELOW, Controls.CalloutPosition.RIGHT, Controls.CalloutPosition.ABOVE],
                                purpose: Controls.CalloutPurpose.MENU,
                                visible: false });
                            p.flyoutCallout.on("hide", this.getDelegate(this.onFlyoutHide));

                            // create a scrollview in the callout
                            p.flyoutScrollView = SDL.jQuery(p.flyoutMenuElement.firstElementChild).scrollView({ overflowX: "hidden" });
                        }

                        this.updateFlyoutMenuList(); // populate the list
                        this.setFlyoutMenuListDimensions(); // set the size of the list element
                        this.setFlyoutPosition(); // define flyout's position
                        p.flyoutCallout.show(); // show the callout
                        this.scrollToFlyoutMenuSelection(); // ensure the selected item is in screen

                        this.fireEvent("propertychange", { property: "ribbonTabsFlyoutMenuShown", value: true });
                    }
                };

                TopBar.prototype.setFlyoutPosition = function () {
                    var p = this.properties;
                    if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        p.flyoutCallout.location(p.$tabsOverflowButton);
                    }
                };

                TopBar.prototype.updateFlyoutMenuList = function () {
                    var _this = this;
                    var p = this.properties;
                    if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        var $listItems = SDL.jQuery(p.flyoutMenuListElement).children();
                        var skippedTabsCount = 0;
                        p.options.ribbonTabs.forEach(function (tab, index) {
                            if (tab.hidden) {
                                skippedTabsCount++;
                            } else {
                                var item = ($listItems.length > (index - skippedTabsCount)) ? $listItems.eq(index - skippedTabsCount)[0] : SDL.jQuery("<div><div></div><span></span></div>").attr("data-sdl-topbar-ribbon-tab-index", index).appendTo(p.flyoutMenuListElement)[0];

                                _this.updateMenuItem(item, tab);
                            }
                        });

                        var listItemsCount = p.options.ribbonTabs.length - skippedTabsCount;
                        if ($listItems.length > listItemsCount) {
                            $listItems.slice(listItemsCount).remove();
                        }
                    }
                };

                TopBar.prototype.updateMenuItem = function (item, tab) {
                    if (item.lastElementChild.textContent != tab.label) {
                        item.lastElementChild.textContent = tab.label;
                    }
                    SDL.jQuery(item).toggleClass("sdl-topbar-ribbon-tab-selected", tab.id == this.properties.options.selectedRibbonTabId);
                };

                TopBar.prototype.setFlyoutMenuListDimensions = function () {
                    var p = this.properties;
                    if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        var scrollElement = p.flyoutMenuElement.firstElementChild;
                        var listElements = p.flyoutMenuListElement.children;

                        scrollElement.style.maxHeight = ((document.documentElement || document.body.parentNode || document.body).offsetHeight - 55) + "px"; // limit the height to the window's height - paddings (2 * 6) - borders (2 * 1) - height of the topbar (31) - callout's pointer (9) - 1
                        scrollElement.style.height = (listElements.length * 36) + "px"; // calculate the actual height

                        var scrollWidth = 0;
                        for (var i = 0, len = listElements.length; i < len; i++) {
                            scrollWidth = Math.max(scrollWidth, listElements[i].scrollWidth); // get the width of the longest title
                        }
                        scrollElement.style.width = scrollWidth + "px";
                    }
                };

                TopBar.prototype.scrollToFlyoutMenuSelection = function () {
                    var p = this.properties;
                    if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        var listElement = p.flyoutMenuListElement;
                        var selected = SDL.jQuery(".sdl-topbar-ribbon-tab-selected", listElement)[0];
                        if (selected) {
                            // scroll to the selected item in the flyout menu list, if the selected item is off screen
                            var top = selected.offsetTop;
                            if (listElement.scrollTop > top) {
                                listElement.scrollTop = top;
                            } else if (listElement.scrollTop < (top - listElement.clientHeight + 36)) {
                                listElement.scrollTop = (top - listElement.clientHeight + 36);
                            }
                        }
                    }
                };

                TopBar.prototype.hideFlyoutMenu = function () {
                    var p = this.properties;
                    if (p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        p.flyoutCallout.hide();
                    }
                };

                TopBar.prototype.onFlyoutHide = function () {
                    this.properties.$tabsOverflowButton.removeClass("sdl-topbar-ribbon-overflown-button-pressed");
                    this.fireEvent("propertychange", { property: "ribbonTabsFlyoutMenuShown", value: false });
                };

                TopBar.prototype.onFlyoutKeyDown = function (e) {
                    var p = this.properties;
                    if (!e.ctrlKey && !e.shiftKey && p.$tabsOverflowButton.hasClass("sdl-topbar-ribbon-overflown-button-pressed")) {
                        var handled = false;
                        switch (e.which) {
                            case SDL.UI.Core.Event.Constants.Keys.LEFT:
                            case SDL.UI.Core.Event.Constants.Keys.UP:
                                this.selectPreviousRibbonTab();
                                handled = true;
                                break;
                            case SDL.UI.Core.Event.Constants.Keys.RIGHT:
                            case SDL.UI.Core.Event.Constants.Keys.DOWN:
                                this.selectNextRibbonTab();
                                handled = true;
                                break;
                            case SDL.UI.Core.Event.Constants.Keys.HOME:
                                this.selectFirstRibbonTab();
                                handled = true;
                                break;
                            case SDL.UI.Core.Event.Constants.Keys.END:
                                this.selectLastRibbonTab();
                                handled = true;
                                break;
                            case SDL.UI.Core.Event.Constants.Keys.ENTER:
                                this.hideFlyoutMenu();
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                break;
                        }

                        if (handled) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            this.scrollToFlyoutMenuSelection();
                        }
                    }
                };

                TopBar.prototype.onFlyoutMouseDown = function (e) {
                    if (e.which == 1) {
                        var target = e.target;
                        var index = target.hasAttribute("data-sdl-topbar-ribbon-tab-index") ? target.getAttribute("data-sdl-topbar-ribbon-tab-index") : target.parentElement.getAttribute("data-sdl-topbar-ribbon-tab-index");

                        if (index != null) {
                            this.selectRibbonTabIndex(index);
                            this.hideFlyoutMenu();
                        }
                    }
                };

                TopBar.prototype.selectNextRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    var $selectedTab = this.getSelectedRibbonTab();
                    var $next = $selectedTab.next();
                    while ($next && $next.length && !$next.is(this.properties.$tabsOverflowButton)) {
                        if (!skipHidden || !$next.hasClass("sdl-topbar-ribbon-tab-hidden")) {
                            this.selectRibbonTab($next);
                            return;
                        }
                        $next = $next.next();
                    }
                };

                TopBar.prototype.selectPreviousRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    var $selectedTab = this.getSelectedRibbonTab();
                    var $prev = $selectedTab.prev();
                    while ($prev && $prev.length && !$prev.is(this.properties.$resizeTrigger)) {
                        if (!skipHidden || !$prev.hasClass("sdl-topbar-ribbon-tab-hidden")) {
                            this.selectRibbonTab($prev);
                            return;
                        }
                        $prev = $prev.prev();
                    }
                };

                TopBar.prototype.selectFirstRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    this.selectRibbonTab(this.getFirstRibbonTab(skipHidden));
                };

                TopBar.prototype.selectLastRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    this.selectRibbonTab(this.getLastRibbonTab(skipHidden));
                };

                TopBar.prototype.showRibbonTab = function (tabId) {
                    var tabIndex = this.getRibbonTabIndexById(tabId);
                    if (tabIndex != -1) {
                        var tab = this.properties.options.ribbonTabs[tabIndex];
                        if (tab && tab.hidden) {
                            tab.selected = true;
                            this.populateRibbonTabs();
                            this.fireEvent("propertychange", { property: "ribbonTabs." + this.getRibbonTabIndexById(tabId) + ".hidden", value: false });
                            this.fireEvent("ribbontabshow", { id: tabId });
                        }
                    }
                };

                TopBar.prototype.hideRibbonTab = function (tabId) {
                    var tabIndex = this.getRibbonTabIndexById(tabId);
                    if (tabIndex != -1) {
                        var tab = this.properties.options.ribbonTabs[tabIndex];
                        if (tab && !tab.hidden) {
                            tab.selected = true;
                            this.populateRibbonTabs();
                            this.fireEvent("propertychange", { property: "ribbonTabs." + this.getRibbonTabIndexById(tabId) + ".hidden", value: true });
                            this.fireEvent("ribbontabhide", { id: tabId });
                        }
                    }
                };

                TopBar.prototype.selectRibbonTabId = function (tabId) {
                    if (tabId) {
                        this.selectRibbonTab(this.getRibbonTabById(tabId));
                    }
                };

                TopBar.prototype.selectRibbonTabIndex = function (tabIndex) {
                    this.selectRibbonTab(this.getRibbonTabs().eq(tabIndex));
                };

                TopBar.prototype.getSelectedRibbonTab = function () {
                    return this.properties.$ribbonTabsContainer.children(".sdl-topbar-ribbon-tab-selected");
                };

                TopBar.prototype.getFirstRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    return this.getRibbonTabs(skipHidden).first();
                };

                TopBar.prototype.getLastRibbonTab = function (skipHidden) {
                    if (typeof skipHidden === "undefined") { skipHidden = true; }
                    return this.getRibbonTabs(skipHidden).last();
                };

                TopBar.prototype.getRibbonTabs = function (excludeHidden) {
                    if (typeof excludeHidden === "undefined") { excludeHidden = false; }
                    var p = this.properties;
                    var $tabs = p.$ribbonTabsContainer.children().not(p.$resizeTrigger).not(p.$tabsOverflowButton);
                    if (excludeHidden) {
                        $tabs = $tabs.not(".sdl-topbar-ribbon-tab-hidden");
                    }
                    return $tabs;
                };

                TopBar.prototype.selectRibbonTab = function ($tab) {
                    if ($tab && $tab.length && !$tab.hasClass("sdl-topbar-ribbon-tab-selected")) {
                        var p = this.properties;
                        var tabId = p.options.selectedRibbonTabId = $tab.data("tab-id");

                        var $prevSelection = this.getSelectedRibbonTab();
                        if ($prevSelection.length) {
                            $prevSelection.removeClass("sdl-topbar-ribbon-tab-selected");
                        }
                        $tab.addClass("sdl-topbar-ribbon-tab-selected");
                        if ($tab[0].offsetTop) {
                            this.calculateRibbonTabs();
                        }

                        this.fireEvent("propertychange", { property: "selectedRibbonTabId", value: tabId });
                        this.fireEvent("ribbonselectionchange", { id: tabId });
                    }
                };

                TopBar.prototype.selectedRibbonTabId = function () {
                    return this.properties.options.selectedRibbonTabId;
                };

                TopBar.prototype.showButton = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button && button.hidden) {
                        button.selected = true;
                        this.updateButtons();
                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".hidden", value: false });
                        this.fireEvent("showbutton", { button: buttonId });
                    }
                };

                TopBar.prototype.hideButton = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button && !button.hidden) {
                        button.selected = true;
                        this.updateButtons();
                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".hidden", value: true });
                        this.fireEvent("hidebutton", { button: buttonId });
                    }
                };

                TopBar.prototype.selectButton = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button && !button.selected) {
                        button.selected = true;
                        var $button = this.properties.$buttonsContainer.find(".sdl-topbar-button-" + buttonId).addClass("sdl-topbar-button-selected");
                        var buttonPosition = this.getButtonPosition($button);

                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".position.left", value: buttonPosition.left });
                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".position.right", value: buttonPosition.right });
                        this.fireEvent("positionbutton", { button: buttonId, position: buttonPosition });
                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".selected", value: button.selected });
                        this.fireEvent("selectbutton", { button: buttonId });
                    }
                };

                TopBar.prototype.unselectButton = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button && button.selected) {
                        button.selected = false;
                        this.properties.$buttonsContainer.find(".sdl-topbar-button-" + buttonId).removeClass("sdl-topbar-button-selected");
                        this.fireEvent("propertychange", { property: "buttons." + buttonId + ".selected", value: button.selected });
                        this.fireEvent("unselectbutton", { button: buttonId });
                    }
                };

                TopBar.prototype.toggleButton = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button) {
                        if (button.selected) {
                            this.unselectButton(buttonId);
                        } else {
                            this.selectButton(buttonId);
                        }
                    }
                };

                TopBar.prototype.getButtonSelectionState = function (buttonId) {
                    var button = this.properties.options.buttons[buttonId];
                    if (button) {
                        if (button.selected) {
                            return {
                                selected: (button.selected && true) || false,
                                position: this.getButtonPosition(this.properties.$buttonsContainer.find(".sdl-topbar-button-" + buttonId))
                            };
                        } else {
                            return { selected: false };
                        }
                    } else {
                        return null;
                    }
                };

                TopBar.prototype.getButtonPosition = function ($button) {
                    var buttonsContainer = this.properties.$buttonsContainer[0];
                    var buttonPosition = $button[0].offsetLeft + 15;
                    return {
                        right: buttonsContainer.offsetWidth - buttonPosition,
                        left: buttonsContainer.offsetLeft + buttonPosition
                    };
                };
                return TopBar;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.TopBar = TopBar;

            TopBar.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$TopBar$disposeInterface() {
                var _this = this;
                var p = _this.properties;

                if (p.$element) {
                    SDL.Globalize.removeEventListener("culturechange", this.removeDelegate(this.updateButtons));
                    p.$resizeTriggerControl.dispose();
                    p.$ribbonTabsContainer.off("click", this.removeDelegate(this.onRibbonTabClick));
                    p.$buttonsContainer.off("click", this.removeDelegate(this.onButtonClick));

                    if (p.flyoutCallout) {
                        p.flyoutCallout.off("hide", this.removeDelegate(this.onFlyoutHide));
                        SDL.jQuery(p.flyoutMenuElement).off("keydown", this.removeDelegate(this.onFlyoutKeyDown));
                        SDL.jQuery(p.flyoutMenuListElement).off("mousedown", this.removeDelegate(this.onFlyoutMouseDown));

                        p.flyoutCallout.dispose();
                        p.flyoutScrollView.dispose();

                        p.flyoutCallout = p.flyoutMenuElement = p.flyoutMenuListElement = p.flyoutScrollView = null;
                    }

                    //p.$buttonsContainer.children().children().tooltip().dispose();
                    p.$element.removeClass("sdl-topbar").empty();
                    p.$element = p.$buttonsContainer = p.$ribbonTabsContainer = p.$resizeTrigger = p.$resizeTriggerControl = p.$tabsOverflowButton = null;

                    if (!p.options.hostMode) {
                        SDL.jQuery(document.documentElement).removeClass("sdl-topbar-page");
                    }
                }
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.TopBar", TopBar);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
//# sourceMappingURL=TopBar.js.map
