/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Tooltip/Tooltip.jQuery.ts" />
/// <reference path="../ScrollView/ScrollView.jQuery.ts" />
/// <reference path="../Callout/Callout.jQuery.ts" />
/// <reference path="../ResizeTrigger/ResizeTrigger.jQuery.ts" />
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
            eval(SDL.Client.Types.OO.enableCustomInheritance);
            var TopPageTabs = (function (_super) {
                __extends(TopPageTabs, _super);
                function TopPageTabs(element, options) {
                    _super.call(this, element, options || {});
                    this.flyoutButtonMinWidth = 40;
                    this.tabSwitchHeight = 101;
                    this.flyoutMenuPositionBox = { xLeft: -this.flyoutButtonMinWidth, yAbove: 0, xRight: -1, yBelow: this.tabSwitchHeight };
                    this.isFlyoutButtonShown = false;
                    this.isFlyoutMenuShown = false;
                    this.isFlyoutMenuHiding = false;
                    this.tabsPagesMutationObservers = [];
                    this.tabsNoPagesMutationObservers = [];
                    this.monitorCount = 0;
                }
                TopPageTabs.prototype.$initialize = function () {
                    this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

                    var p = this.properties;
                    var $element = this.$element = SDL.jQuery(p.element);
                    this.$pages = SDL.jQuery();

                    p.options = SDL.jQuery.extend({}, p.options);

                    this.initialTabIndex = $element.attr("tabIndex");
                    $element.attr("tabIndex", this.initialTabIndex || "0").addClass("sdl-tabs-container").keydown(this.getDelegate(this.onKeyDown)); // keyboard navigation

                    this.processHidden();
                    this.processDescendants();
                    this.setSelectedIndex(p.options.selectedIndex || 0);
                    this.recalculate(); // process tabs contents

                    this.$resizeTrigger = SDL.jQuery("<div class='sdl-tabs-resizetrigger' data-sdl-tabs-no-page='true'></div>").prependTo($element);

                    $element.mousedown(this.getDelegate(this.onElementMouseDown)).scroll(this.cancelScroll); // disable scrolling, sometimes it would scroll despite overflow being set to hidden
                    if ($element.is("body")) {
                        SDL.jQuery($element[0].ownerDocument).scroll(this.cancelScroll); // if body is the tabs control, disable scrolling on the document
                    }

                    this.$resizeTrigger.resizeTrigger().resize(this.getDelegate(this.onTabsElementResize));
                    if (window.MutationObserver) {
                        this.containerMutationObserver = new MutationObserver(this.getDelegate(this.onTabsChildrenChange));
                        this.containerMutationObserver.observe(p.element, {
                            childList: true
                        });
                    } else {
                        // IE9 and IE10 don't have MutationObserver -> check changes avery 100 ms
                        this.startMonitoring();
                    }
                };

                TopPageTabs.prototype.update = function (options) {
                    if (options) {
                        this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

                        var changedProperties = [];

                        var selectedIndex = this.getSelectedIndex();
                        if (options.selectedIndex != null && options.selectedIndex >= 0 && options.selectedIndex < this.$element.children(":not([data-sdl-tabs-no-page=true])").length) {
                            // new selected index is specified
                            if (options.selectedIndex != selectedIndex) {
                                this.setSelectedIndex(options.selectedIndex);
                                changedProperties.push("selectedIndex");
                            }
                        } else if (selectedIndex < 0) {
                            this.selectFirst();
                            changedProperties.push("selectedIndex");
                        }

                        for (var i = 0, len = changedProperties.length; i < len; i++) {
                            this.fireEvent("propertychange", { property: changedProperties[i], value: options[changedProperties[i]] });
                        }
                    }

                    this.processChanges();
                };

                TopPageTabs.prototype.selectNext = function () {
                    var oldPage = this.$element.children(".sdl-tabs-page-selected");
                    if (oldPage.length) {
                        var next = oldPage;
                        do {
                            next = next.next(); // select next visible tab, skipping no-page elements and hidden tabs
                        } while(next.length && (next.attr("data-sdl-tabs-no-page") == "true" || !next[0].offsetWidth));

                        this.updateSelection(next, oldPage);
                    } else {
                        this.selectFirst();
                    }
                };

                TopPageTabs.prototype.selectPrevious = function () {
                    var oldPage = this.$element.children(".sdl-tabs-page-selected");
                    if (oldPage.length) {
                        var prev = oldPage;
                        do {
                            prev = prev.prev(); // select previous visible tab, skipping no-page elements and hidden tabs
                        } while(prev.length && (prev.attr("data-sdl-tabs-no-page") == "true" || !prev[0].offsetWidth));

                        this.updateSelection(prev, oldPage);
                    } else {
                        this.selectFirst();
                    }
                };

                TopPageTabs.prototype.selectFirst = function () {
                    this.setSelectedIndex(0);
                };

                TopPageTabs.prototype.selectLast = function () {
                    this.updateSelection(this.$element.children(":not([data-sdl-tabs-no-page=true])").last());
                };

                TopPageTabs.prototype.setSelectedIndex = function (index) {
                    this.updateSelection(this.$element.children(":not([data-sdl-tabs-no-page=true])").eq(index));
                };

                TopPageTabs.prototype.setSelection = function (page) {
                    if (page) {
                        this.updateSelection(page.first());
                    }
                };

                TopPageTabs.prototype.setSelectedElement = function (page) {
                    return this.setSelection(SDL.jQuery(page));
                };

                TopPageTabs.prototype.getSelectedIndex = function () {
                    return this.$element.children(":not([data-sdl-tabs-no-page=true])").index(this.getSelection());
                };

                TopPageTabs.prototype.getSelection = function () {
                    return this.$element.children(".sdl-tabs-page-selected");
                };

                TopPageTabs.prototype.getSelectedElement = function () {
                    return this.getSelection()[0];
                };

                TopPageTabs.prototype.updateFlyoutButton = function (show, flyoutButtonWidth) {
                    if (show) {
                        if (!this.isFlyoutButtonShown) {
                            this.$element.addClass("sdl-tabs-container-overflown");
                            this.isFlyoutButtonShown = true;
                        }
                        var newXLeft = -(flyoutButtonWidth || this.flyoutButtonMinWidth);
                        if (newXLeft != this.flyoutMenuPositionBox.xLeft) {
                            this.flyoutMenuPositionBox.xLeft = newXLeft;
                            this.positionFlyoutMenu();
                        }
                    } else if (this.isFlyoutButtonShown) {
                        this.$element.removeClass("sdl-tabs-container-overflown sdl-tabs-container-overflown-pressed");
                        if (this.isFlyoutMenuShown) {
                            this.flyoutCallout.hide();
                        }
                        this.isFlyoutButtonShown = this.isFlyoutMenuShown = false;
                    }
                };

                TopPageTabs.prototype.positionFlyoutMenu = function () {
                    if (this.isFlyoutMenuShown) {
                        this.flyoutCallout.location(this.flyoutMenuPositionBox);
                    }
                };

                TopPageTabs.prototype.updateFlyoutMenuList = function (element, updateProperty) {
                    var _this = this;
                    if (this.isFlyoutMenuShown) {
                        var listElements;
                        if (!this.flyoutMenuPopulated) {
                            this.flyoutMenuPopulated = true;
                        } else {
                            listElements = this.flyoutMenuListElement.children;
                        }

                        if (listElements && element) {
                            this.updateMenuItem(listElements[this.$pages.index(element)], element, updateProperty);
                        } else {
                            var skippedPagesCount = 0;
                            this.$pages.each(function (index, element) {
                                if (element.offsetWidth) {
                                    var item = listElements ? listElements[index - skippedPagesCount] : SDL.jQuery("<div><div></div><span></span></div>").attr("data-sdl-tabs-page-index", index).appendTo(_this.flyoutMenuListElement)[0];

                                    _this.updateMenuItem(item, element);
                                } else {
                                    skippedPagesCount++;
                                }
                            });
                        }
                    }
                };

                TopPageTabs.prototype.updateMenuItem = function (item, tab, updateProperty) {
                    var selected = !updateProperty || updateProperty == "icon" || updateProperty == "selection" ? tab.className.indexOf("sdl-tabs-page-selected") != -1 : null;

                    var titleElement = tab.firstElementChild;
                    var labelElement;
                    if (titleElement && titleElement.getAttribute("data-sdl-tabs-switch-label")) {
                        labelElement = titleElement;
                        titleElement = titleElement.nextElementSibling;
                    }

                    if (!updateProperty || updateProperty == "icon" || updateProperty == "selection") {
                        // class for the icon is specified using element's attributes: data-sdl-tabs-menu-icon-class-bright and data-sdl-tabs-menu-icon-class-dark
                        var flyoutMenuIconStyle = labelElement && labelElement.getAttribute(selected ? "data-sdl-tabs-menu-icon-class-bright" : "data-sdl-tabs-menu-icon-class-dark") || "";
                        if (flyoutMenuIconStyle ? item.firstElementChild.className != flyoutMenuIconStyle : item.firstElementChild.className) {
                            item.firstElementChild.className = flyoutMenuIconStyle || "";
                        }
                    }

                    if (!updateProperty || updateProperty == "text") {
                        var title = titleElement ? titleElement.textContent : "";
                        if (item.lastElementChild.textContent != title) {
                            item.lastElementChild.textContent = title;
                        }
                    }

                    if (!updateProperty || updateProperty == "selection") {
                        if (selected) {
                            if (item.className.indexOf("sdl-tabs-page-selected") < 0) {
                                SDL.jQuery(item).addClass("sdl-tabs-page-selected");
                            }
                        } else if (item.className.indexOf("sdl-tabs-page-selected") != -1) {
                            SDL.jQuery(item).removeClass("sdl-tabs-page-selected");
                        }
                    }
                };

                TopPageTabs.prototype.invalidateFlyoutMenu = function () {
                    if (this.flyoutMenuListElement) {
                        this.flyoutMenuPopulated = false;
                        this.flyoutMenuListElement.textContent = ""; // remove items from the flyout menu list
                        this.updateFlyoutMenuList();
                    }
                };

                TopPageTabs.prototype.setFlyoutMenuListDimensions = function () {
                    if (this.isFlyoutMenuShown) {
                        var scrollElement = this.flyoutMenuElement.firstElementChild;
                        var listElements = this.flyoutMenuListElement.children;

                        scrollElement.style.maxHeight = ((document.documentElement || document.body.parentNode || document.body).offsetHeight - 14) + "px"; // limit the height to the window's height - paddings (2 * 6) - borders (2 * 1)
                        scrollElement.style.height = (listElements.length * 36) + "px"; // calculate the actual height

                        var scrollWidth = 0;
                        for (var i = 0, len = listElements.length; i < len; i++) {
                            scrollWidth = Math.max(scrollWidth, listElements[i].scrollWidth); // get the width of the longest title
                        }
                        scrollElement.style.width = scrollWidth + "px";
                    }
                };

                TopPageTabs.prototype.scrollToFlyoutMenuSelection = function () {
                    if (this.isFlyoutMenuShown) {
                        var listElement = this.flyoutMenuListElement;
                        var selected = SDL.jQuery(".sdl-tabs-page-selected", listElement)[0];
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

                TopPageTabs.prototype.showFlyoutMenu = function () {
                    if (this.isFlyoutButtonShown && !this.isFlyoutMenuShown) {
                        this.isFlyoutMenuShown = true;
                        if (!this.flyoutMenuElement) {
                            // create flyout menu element as a child of the body
                            var $flyoutMenu = SDL.jQuery("<div class='sdl-tabs-flyout-menu'><div><div data-sdl-scrollview-child='true'></div></div></div>").appendTo(document.body);
                            this.flyoutMenuElement = $flyoutMenu[0];
                            this.flyoutMenuListElement = this.flyoutMenuElement.firstElementChild.firstElementChild;

                            SDL.jQuery(this.flyoutMenuListElement).mousedown(this.getDelegate(this.onFlyoutMouseDown)); // enable selecting items with mouse
                            $flyoutMenu.keydown(this.getDelegate(this.onKeyDown)); // keyboard support in the flyout menu list

                            // create callout control
                            this.flyoutCallout = $flyoutMenu.callout({
                                targetElement: this.properties.element,
                                preferredPosition: [Controls.CalloutPosition.BELOW, Controls.CalloutPosition.RIGHT, Controls.CalloutPosition.ABOVE],
                                purpose: Controls.CalloutPurpose.MENU,
                                visible: false });
                            this.flyoutCallout.on("hide", this.getDelegate(this.onFlyoutHide));

                            // create a scrollview in the callout
                            this.flyoutScrollView = SDL.jQuery(this.flyoutMenuElement.firstElementChild).scrollView({ overflowX: "hidden" });
                        }

                        this.$element.addClass("sdl-tabs-container-overflown-pressed");
                        this.updateFlyoutMenuList(); // populate the list
                        this.setFlyoutMenuListDimensions(); // set the size of the list element
                        this.positionFlyoutMenu(); // set position of the callout
                        this.flyoutCallout.show(); // show the callout
                        this.scrollToFlyoutMenuSelection(); // ensure the selected item is in screen
                    }
                };

                TopPageTabs.prototype.hideFlyoutMenu = function () {
                    if (this.isFlyoutMenuShown) {
                        this.flyoutCallout.hide();
                    }
                };

                TopPageTabs.prototype.processHidden = function () {
                    var changed = false;
                    var lastShownPage;
                    SDL.jQuery.each(this.properties.element.children, function (index, child) {
                        if (!child.offsetWidth) {
                            if (child.getAttribute("data-sdl-tabs-no-page") != "true" && child.className.indexOf("sdl-tabs-page-hidden") < 0) {
                                SDL.jQuery(child).addClass("sdl-tabs-page-hidden");
                                changed = true;
                            }
                        } else {
                            if (child.getAttribute("data-sdl-tabs-no-page") != "true") {
                                lastShownPage = child;
                                if (child.className.indexOf("sdl-tabs-page-hidden") >= 0) {
                                    SDL.jQuery(child).removeClass("sdl-tabs-page-hidden");
                                    changed = true;
                                }
                            } else {
                                lastShownPage = null;
                            }
                        }
                    });

                    if (!lastShownPage != !this.$lastShownPage || lastShownPage && lastShownPage != this.$lastShownPage[0]) {
                        if (this.$lastShownPage) {
                            this.$lastShownPage.removeClass("sdl-tabs-page-last");
                        }

                        if (lastShownPage) {
                            this.$lastShownPage = SDL.jQuery(lastShownPage).addClass("sdl-tabs-page-last");
                        } else {
                            this.$lastShownPage = null;
                        }
                    }
                    return changed;
                };

                TopPageTabs.prototype.processDescendants = function () {
                    var _this = this;
                    var i;
                    var len;
                    var $children = this.$element.children(":not([data-sdl-tabs-no-page=true])");
                    var $addedPages = $children.not(this.$pages);
                    var $removedPages = this.$pages.not($children);

                    var changed = false;

                    if ($addedPages.length || $removedPages.length) {
                        if (window.MutationObserver) {
                            var tabsMutationObservers = this.tabsPagesMutationObservers;
                            for (i = 0; i < $removedPages.length; i++) {
                                for (var j = 0; j < tabsMutationObservers.length; j++) {
                                    var tabMutationObservers = tabsMutationObservers[j];
                                    if (tabMutationObservers.element == $removedPages[i]) {
                                        tabMutationObservers.tabMutationObserver.disconnect();
                                        tabMutationObservers.tabSwitchLabelMutationObserver.disconnect();
                                        tabMutationObservers.tabSwitchTitleMutationObserver.disconnect();
                                        tabsMutationObservers.splice(j, 1);
                                        break;
                                    }
                                }
                            }

                            var onPageAttributeChangeDelegate = this.getDelegate(this.onPageAttributeChange);
                            var onPageSwitchLabelChangeDelegate = this.getDelegate(this.onPageSwitchLabelChange);
                            var onPageSwitchTitleChangeDelegate = this.getDelegate(this.onPageSwitchTitleChange);
                            for (i = 0; i < $addedPages.length; i++) {
                                var tabMutationObservers = {
                                    element: $addedPages[i],
                                    tabMutationObserver: new MutationObserver(onPageAttributeChangeDelegate),
                                    tabSwitchLabelMutationObserver: new MutationObserver(onPageSwitchLabelChangeDelegate),
                                    tabSwitchTitleMutationObserver: new MutationObserver(onPageSwitchTitleChangeDelegate)
                                };
                                tabsMutationObservers.push(tabMutationObservers);

                                // monitor the page itself, react if it becomes hidden or selected
                                tabMutationObservers.tabMutationObserver.observe($addedPages[i], {
                                    attributes: true,
                                    attributeFilter: ["class", "style"]
                                });

                                // monitor the page label if found, need for the flyout menu icon
                                var titleElement = $addedPages[i].firstElementChild;
                                if (titleElement && titleElement.hasAttribute("data-sdl-tabs-switch-label")) {
                                    tabMutationObservers.tabSwitchLabelMutationObserver.observe(titleElement, {
                                        attributes: true,
                                        attributeFilter: ["data-sdl-tabs-menu-icon-class-bright", "data-sdl-tabs-menu-icon-class-dark"]
                                    });
                                    titleElement = titleElement.nextElementSibling;
                                }

                                // monitor the page title, need for the flyout menu label
                                if (titleElement) {
                                    tabMutationObservers.tabSwitchTitleMutationObserver.observe(titleElement, {
                                        characterData: true,
                                        subtree: true
                                    });
                                }
                            }
                        }

                        $removedPages.removeClass("sdl-tabs-page-selected").children(":first-child, :first-child[data-sdl-tabs-switch-label] + *").tooltip().dispose();
                        $addedPages.children(":first-child, :first-child[data-sdl-tabs-switch-label] + *").tooltip({ showIfNoOverflow: false, trackMouse: true, relativeTo: "mouse", showWhenCursorStationary: true });
                        changed = true;
                    } else {
                        for (i = 0, len = $children.length - 1; i < len; i++) {
                            if ($children[i] != this.$pages[i]) {
                                changed = true;
                                break;
                            }
                        }
                    }
                    this.$pages = $children;

                    if (window.MutationObserver) {
                        for (i = this.tabsNoPagesMutationObservers.length - 1; i >= 0; i--) {
                            var noPageElement = this.tabsNoPagesMutationObservers[i].element;
                            if (noPageElement.parentElement != this.properties.element || noPageElement.getAttribute("data-sdl-tabs-no-page") != "true") {
                                this.tabsNoPagesMutationObservers[i].tabMutationObserver.disconnect();
                                this.tabsNoPagesMutationObservers.splice(i, 1);
                            }
                        }

                        var resizeTrigger = this.$resizeTrigger && this.$resizeTrigger[0];
                        var onNoPageChangeDelegate = this.getDelegate(this.onNoPageChange);
                        this.$element.children("[data-sdl-tabs-no-page=true]").each(function (i, noPageElement) {
                            if (noPageElement != resizeTrigger) {
                                var tabsNoPagesMutationObservers = _this.tabsNoPagesMutationObservers;
                                for (i = tabsNoPagesMutationObservers.length - 1; i >= 0; i--) {
                                    var tabNoPageElement = _this.tabsNoPagesMutationObservers[i].element;
                                    if (tabNoPageElement.parentElement == noPageElement) {
                                        return;
                                    }
                                }

                                // need to set mutation observer for no-page tabs to detect changes in dimensions
                                var tabMutationObservers = {
                                    element: noPageElement,
                                    tabMutationObserver: new MutationObserver(onNoPageChangeDelegate)
                                };
                                tabsNoPagesMutationObservers.push(tabMutationObservers);

                                // monitor the no-page, might change in size due to any change
                                tabMutationObservers.tabMutationObserver.observe(noPageElement, {
                                    attributes: true,
                                    characterData: true,
                                    childList: true,
                                    subtree: true
                                });
                            }
                        });
                    }

                    return changed;
                };

                TopPageTabs.prototype.recalculate = function () {
                    var element = this.properties.element;
                    if (element.offsetHeight && element.offsetWidth) {
                        var resizeTriggerElement = this.$resizeTrigger && this.$resizeTrigger[0];
                        var tab = element.firstElementChild;
                        var availableWidth = element.clientWidth;

                        var remainingWidth = availableWidth;
                        while (tab) {
                            if (tab != resizeTriggerElement) {
                                remainingWidth -= (tab.offsetWidth || 0);
                                if (remainingWidth < 0) {
                                    break;
                                }
                            }
                            tab = tab.nextElementSibling;
                        }

                        if (remainingWidth >= 0) {
                            if (this.$leftOffScreenTabs) {
                                this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
                                this.$leftOffScreenTabs = null;
                            }
                            if (this.$firstOffScreenTab) {
                                this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
                                this.$firstOffScreenTab = null;
                            }
                            this.updateFlyoutButton(false);
                        } else {
                            availableWidth -= (this.flyoutButtonMinWidth - 1); // width_of_flyout_button - border

                            // ensure selected tab is in screen
                            var rightAlignedTab = this.getSelectedElement();

                            if (rightAlignedTab && rightAlignedTab.offsetWidth) {
                                if (rightAlignedTab.offsetTop == 0 && (rightAlignedTab.offsetLeft + rightAlignedTab.offsetWidth <= availableWidth)) {
                                    // selected tab is in screen -> keep currently last in-screen tab right-aligned
                                    tab = rightAlignedTab;
                                    remainingWidth = availableWidth - tab.offsetLeft;
                                    rightAlignedTab = null;
                                }
                            } else {
                                // no selected tab or it is hidden -> we'll keep currently last in-screen tab right-aligned
                                tab = element.firstElementChild;
                                remainingWidth = availableWidth;
                                rightAlignedTab = null;
                            }

                            if (!rightAlignedTab) {
                                do {
                                    while (tab && (!tab.offsetWidth || tab == resizeTriggerElement)) {
                                        tab = tab.nextElementSibling; // skip hidden tabs
                                    }

                                    if (!tab) {
                                        break;
                                    } else {
                                        remainingWidth -= tab.offsetWidth;
                                        if (remainingWidth >= 0) {
                                            rightAlignedTab = tab;
                                            tab = tab.nextElementSibling;
                                        } else {
                                            break;
                                        }
                                    }
                                } while(1);
                            }

                            //else
                            //{
                            // if selection is off-screen, then show it right-aligned
                            //}
                            // determine what leftmost tabs will not fit the available width if the rightAlignedTab tab is right-aligned
                            availableWidth -= rightAlignedTab.offsetWidth;
                            tab = rightAlignedTab.previousElementSibling;
                            if (availableWidth > 0) {
                                remainingWidth = availableWidth;
                                while (tab) {
                                    if (tab != resizeTriggerElement) {
                                        remainingWidth -= (tab.offsetWidth || 0);
                                        if (remainingWidth < 0) {
                                            break;
                                        } else {
                                            availableWidth = remainingWidth;
                                        }
                                    }
                                    tab = tab.previousElementSibling;
                                }
                            }

                            var leftOffScreenTabs = tab ? [] : null;
                            while (tab) {
                                if (tab != resizeTriggerElement) {
                                    leftOffScreenTabs.push(tab);
                                }
                                tab = tab.previousElementSibling;
                            }

                            // select following sibling tab that will be the first off-screen on the right
                            tab = rightAlignedTab.nextElementSibling;

                            var firstOffScreenTab;
                            remainingWidth = availableWidth;
                            while (tab && !firstOffScreenTab) {
                                if (tab != resizeTriggerElement) {
                                    remainingWidth -= (tab.offsetWidth || 0);
                                    if (remainingWidth < 0) {
                                        firstOffScreenTab = tab;
                                    } else {
                                        availableWidth = remainingWidth;
                                    }
                                }
                                tab = tab.nextElementSibling;
                            }
                            ;

                            if (leftOffScreenTabs && leftOffScreenTabs.length) {
                                var $leftOffScreenTabs = SDL.jQuery(leftOffScreenTabs);
                                if (this.$leftOffScreenTabs) {
                                    this.$leftOffScreenTabs.not(leftOffScreenTabs).removeClass("sdl-tabs-tab-left-off-screen");
                                    $leftOffScreenTabs.not(this.$leftOffScreenTabs).addClass("sdl-tabs-tab-left-off-screen");
                                } else {
                                    $leftOffScreenTabs.addClass("sdl-tabs-tab-left-off-screen");
                                }
                                this.$leftOffScreenTabs = $leftOffScreenTabs;
                            } else if (this.$leftOffScreenTabs) {
                                this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
                                this.$leftOffScreenTabs = null;
                            }

                            if (!this.$firstOffScreenTab != !firstOffScreenTab || firstOffScreenTab && firstOffScreenTab != this.$firstOffScreenTab[0]) {
                                if (this.$firstOffScreenTab) {
                                    this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
                                }

                                if (firstOffScreenTab) {
                                    this.$firstOffScreenTab = SDL.jQuery(firstOffScreenTab).addClass("sdl-tabs-tab-first-off-screen");
                                } else {
                                    this.$firstOffScreenTab = null;
                                }
                            }

                            this.updateFlyoutButton(true, availableWidth + this.flyoutButtonMinWidth);
                        }
                    }
                };

                TopPageTabs.prototype.onElementMouseDown = function (e) {
                    var _this = this;
                    if (e.which == 1) {
                        if (e.target == this.properties.element) {
                            if (!this.isFlyoutMenuShown && (e.offsetY || e.originalEvent.layerY || 0) < this.tabSwitchHeight) {
                                this.showFlyoutMenu();
                            }
                        } else {
                            var $targetPage = SDL.jQuery(e.target).closest(this.$element.children(":not([data-sdl-tabs-no-page=true])"));
                            if ($targetPage.length) {
                                // IE workaround: focus is put in an element in side a tab switch even if there's no tabIndex specified
                                // -> have to reset to the tabs element itself for proper :focus styling
                                var firstChild;
                                if (e.target == $targetPage[0] || e.target == (firstChild = $targetPage[0].firstElementChild) || (firstChild.hasAttribute("data-sdl-tabs-switch-label") && (e.target == firstChild.nextElementSibling || SDL.jQuery.contains(firstChild.nextElementSibling, e.target))) || SDL.jQuery.contains(firstChild, e.target)) {
                                    // mouse down was on an element in the tab switch -> check after the event what element gets focus
                                    setTimeout(function () {
                                        // in IE the focus is placed in a label in the tab switch -> need to set focus to the control element
                                        if (document.activeElement != _this.properties.element && document.activeElement == $targetPage[0] || document.activeElement == (firstChild = $targetPage[0].firstElementChild) || (firstChild.hasAttribute("data-sdl-tabs-switch-label") && (document.activeElement == firstChild.nextElementSibling || SDL.jQuery.contains(firstChild.nextElementSibling, document.activeElement))) || SDL.jQuery.contains(firstChild, document.activeElement)) {
                                            _this.$element.focus();
                                        }
                                    });
                                }

                                // end of workaround
                                this.updateSelection($targetPage); // select the corresponding tab page
                            }
                        }
                    }
                };

                TopPageTabs.prototype.onFlyoutMouseDown = function (e) {
                    if (e.which == 1) {
                        var target = e.target;
                        var index = (target.hasAttribute("data-sdl-tabs-page-index") ? target.getAttribute("data-sdl-tabs-page-index") : target.parentElement.getAttribute("data-sdl-tabs-page-index"));

                        if (index != null) {
                            this.setSelectedIndex(index);
                            this.hideFlyoutMenu();
                        }
                    }
                };

                TopPageTabs.prototype.onFlyoutHide = function () {
                    if (this.isFlyoutMenuShown) {
                        this.isFlyoutMenuShown = false;
                        this.$element.removeClass("sdl-tabs-container-overflown-pressed");
                    }
                };

                TopPageTabs.prototype.onKeyDown = function (e) {
                    if (!e.ctrlKey && !e.shiftKey && (this.isFlyoutMenuShown || document.activeElement == this.properties.element)) {
                        var handled = false;
                        switch (e.which) {
                            case 37 /* LEFT */:
                                this.selectPrevious();
                                handled = true;
                                break;
                            case 39 /* RIGHT */:
                                this.selectNext();
                                handled = true;
                                break;
                            case 36 /* HOME */:
                                this.selectFirst();
                                handled = true;
                                break;
                            case 35 /* END */:
                                this.selectLast();
                                handled = true;
                                break;
                            case 38 /* UP */:
                                if (this.isFlyoutMenuShown) {
                                    this.selectPrevious();
                                    handled = true;
                                }
                                break;
                            case 40 /* DOWN */:
                                if (this.isFlyoutMenuShown) {
                                    this.selectNext();
                                    handled = true;
                                }
                                break;
                            case 13 /* ENTER */:
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

                TopPageTabs.prototype.cancelScroll = function (e) {
                    var element = e.target;
                    if (element.nodeType == 9) {
                        var html = element.documentElement;
                        html.scrollLeft = html.scrollTop = 0;

                        element = element.body;
                    }
                    element.scrollLeft = element.scrollTop = 0;
                };

                TopPageTabs.prototype.updateSelection = function (newPage, oldPage) {
                    var _this = this;
                    if (newPage.length && !newPage.attr("data-sdl-tabs-no-page") && newPage.parent().is(this.$element) && newPage[0].offsetWidth) {
                        if (!oldPage) {
                            oldPage = this.$element.children(".sdl-tabs-page-selected");
                        }

                        if (newPage[0] != oldPage[0]) {
                            oldPage.removeClass("sdl-tabs-page-selected");
                            newPage.addClass("sdl-tabs-page-selected");

                            oldPage.each(function (index, element) {
                                return _this.updateFlyoutMenuList(element, "selection");
                            });
                            this.updateFlyoutMenuList(newPage[0], "selection");
                            this.scrollToFlyoutMenuSelection();

                            var $children = this.$element.children(":not([data-sdl-tabs-no-page=true])");
                            var newIndex = $children.index(newPage[0]);
                            this.fireEvent("selectionchange", {
                                oldIndex: $children.index(oldPage[0]),
                                index: newIndex });
                            this.fireEvent("propertychange", { property: "selectedIndex", value: newIndex });
                        }
                    }
                };

                TopPageTabs.prototype.onTabsElementResize = function () {
                    this.stopMonitoring();
                    this.recalculate();
                    this.resumeMonitoring();
                };

                TopPageTabs.prototype.onTabsChildrenChange = function () {
                    var changed = this.processHidden();
                    changed = this.processDescendants() || changed;
                    if (changed) {
                        // list of pages changed -> need to invalidate the flyout menu
                        this.invalidateFlyoutMenu();
                    }

                    // tabs (page or no page) were added/removed -> need recalculate dimensions
                    this.recalculate();
                };

                TopPageTabs.prototype.onPageAttributeChange = function (changes) {
                    // the page might have become hidden/shown and/or selected -> need recalculate and update flyout menu list
                    var menuInvalidate = this.processHidden();
                    if (menuInvalidate) {
                        // pages were hidden or shown -> need to invalidate the flyout menu
                        this.invalidateFlyoutMenu();
                    }

                    this.recalculate();

                    if (!menuInvalidate) {
                        for (var i = 0; i < changes.length; i++) {
                            var change = changes[i];
                            if (change.type == "attributes") {
                                if (change.attributeName == "class") {
                                    // ensure the flyout out menu list is up to date
                                    this.updateFlyoutMenuList(change.target, "selection");
                                }
                            }
                        }
                    }
                };

                TopPageTabs.prototype.onPageSwitchLabelChange = function (changes) {
                    for (var i = 0; i < changes.length; i++) {
                        var change = changes[i];
                        if (change.type == "attributes") {
                            var selected = change.target.parentNode.className.indexOf("sdl-tabs-page-selected") != -1;
                            if ((change.attributeName == "data-sdl-tabs-menu-icon-class-bright" && selected) || (change.attributeName == "data-sdl-tabs-menu-icon-class-dark" && !selected)) {
                                // menu icon has changed -> update the menu
                                this.updateFlyoutMenuList(change.target.parentNode, "icon");
                            }
                        }
                    }
                };

                TopPageTabs.prototype.onPageSwitchTitleChange = function (changes) {
                    for (var i = 0; i < changes.length; i++) {
                        var change = changes[i];
                        if (change.type == "characterData") {
                            // tab's title has changed -> update the menu
                            this.updateFlyoutMenuList(SDL.jQuery(change.target).closest(this.$pages)[0], "text");
                        }
                    }
                };

                TopPageTabs.prototype.onNoPageChange = function () {
                    // 'no-page' tab changed, might result in changed dimensions -> recalculate
                    this.recalculate();
                };

                TopPageTabs.prototype.processChanges = function () {
                    if (this.monitoring) {
                        this.stopMonitoring();

                        var changed = this.processHidden();
                        if (changed || ++this.monitorCount == 2) {
                            this.monitorCount = 0;
                            changed = this.processDescendants() || changed;

                            if (changed) {
                                this.invalidateFlyoutMenu(); // tabs were added/removed/shown/hidden -> invalidate the flyout menu
                            } else {
                                this.updateFlyoutMenuList(); // no change detected, text/icons might still have changed -> update the flyout menu in that case
                            }
                        }

                        this.recalculate(); // always recaculate as contents might have changed because of 'no-tab' pages changing their dimensions

                        this.resumeMonitoring();
                    }
                };

                TopPageTabs.prototype.startMonitoring = function () {
                    this.monitoring = true;
                    this.monitorTimeout = setTimeout(this.getDelegate(this.processChanges), 500);
                };

                TopPageTabs.prototype.stopMonitoring = function () {
                    if (this.monitorTimeout) {
                        clearTimeout(this.monitorTimeout);
                        this.monitorTimeout = null;
                    }
                };

                TopPageTabs.prototype.resumeMonitoring = function () {
                    if (this.monitoring) {
                        this.monitorTimeout = setTimeout(this.getDelegate(this.processChanges), 500);
                    }
                };

                TopPageTabs.prototype.cleanUp = function () {
                    var $element = this.$element;
                    var options = this.properties.options;

                    if (this.monitorTimeout) {
                        this.stopMonitoring();
                        this.monitorTimeout = null;
                    }

                    if (this.$resizeTrigger) {
                        this.$resizeTrigger.resizeTrigger().dispose().remove();
                        this.$resizeTrigger = null;
                    }

                    if (this.containerMutationObserver) {
                        this.containerMutationObserver.disconnect();
                        this.containerMutationObserver = null;
                    }

                    if (this.tabsPagesMutationObservers) {
                        for (var i = 0; i < this.tabsPagesMutationObservers.length; i++) {
                            var tabMutationObservers = this.tabsPagesMutationObservers[i];
                            tabMutationObservers.tabMutationObserver.disconnect();
                            tabMutationObservers.tabSwitchLabelMutationObserver.disconnect();
                            tabMutationObservers.tabSwitchTitleMutationObserver.disconnect();
                        }
                        this.tabsPagesMutationObservers = null;
                    }

                    if (this.tabsNoPagesMutationObservers) {
                        for (var i = 0; i < this.tabsNoPagesMutationObservers.length; i++) {
                            this.tabsNoPagesMutationObservers[i].tabMutationObserver.disconnect();
                        }
                        this.tabsNoPagesMutationObservers = null;
                    }

                    $element.removeClass("sdl-tabs-container sdl-tabs-container-overflown sdl-tabs-container-overflown-pressed").off("scroll", this.cancelScroll);
                    if ($element.is("body")) {
                        SDL.jQuery($element[0].ownerDocument).off("scroll", this.cancelScroll);
                    }

                    this.$pages.removeClass("sdl-tabs-page-selected sdl-tabs-page-hidden").children(":first-child, :first-child[data-sdl-tabs-switch-label] + *").tooltip().dispose();

                    if (this.$firstOffScreenTab) {
                        this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
                        this.$firstOffScreenTab = null;
                    }

                    if (this.$lastShownPage) {
                        this.$lastShownPage.removeClass("sdl-tabs-page-last");
                        this.$lastShownPage = null;
                    }

                    if (this.$leftOffScreenTabs) {
                        this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
                        this.$leftOffScreenTabs = null;
                    }

                    var elementMouseDownDelegate = this.removeDelegate(this.onElementMouseDown);
                    if (elementMouseDownDelegate) {
                        this.$element.off("mousedown", elementMouseDownDelegate);
                    }

                    var keyDownDelegate = this.removeDelegate(this.onKeyDown);
                    if (keyDownDelegate) {
                        this.$element.off("keydown", keyDownDelegate);
                    }

                    if (this.flyoutMenuElement) {
                        var flyoutMouseDownDelegate = this.removeDelegate(this.onFlyoutMouseDown);
                        if (flyoutMouseDownDelegate) {
                            SDL.jQuery(this.flyoutMenuListElement).off("mousedown", flyoutMouseDownDelegate);
                        }

                        var flyoutHideDelegate = this.removeDelegate(this.onFlyoutHide);
                        if (flyoutHideDelegate) {
                            this.flyoutCallout.off("hide", flyoutHideDelegate);
                        }

                        if (keyDownDelegate) {
                            SDL.jQuery(this.flyoutMenuElement).off("keydown", keyDownDelegate);
                        }

                        this.flyoutScrollView.dispose();
                        this.flyoutCallout.dispose();
                        document.body.removeChild(this.flyoutMenuElement);
                        this.flyoutMenuElement = this.flyoutMenuListElement = this.flyoutCallout = this.flyoutScrollView = null;
                    }

                    if (!this.initialTabIndex) {
                        $element.removeAttr("tabIndex");
                    } else {
                        $element.attr("tabIndex", this.initialTabIndex);
                    }

                    this.$element = this.$pages = null;
                };
                return TopPageTabs;
            })(SDL.UI.Core.Controls.ControlBase);
            Controls.TopPageTabs = TopPageTabs;

            TopPageTabs.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$TopPageTabs$disposeInterface() {
                this.cleanUp();
            });

            SDL.Client.Types.OO.createInterface("SDL.UI.Controls.TopPageTabs", TopPageTabs);
        })(UI.Controls || (UI.Controls = {}));
        var Controls = UI.Controls;
    })(SDL.UI || (SDL.UI = {}));
    var UI = SDL.UI;
})(SDL || (SDL = {}));
