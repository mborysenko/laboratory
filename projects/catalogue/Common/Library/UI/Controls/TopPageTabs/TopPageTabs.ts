/// <reference path="../../SDL.Client.UI.Core/Controls/ControlBase.d.ts" />
/// <reference path="../../SDL.Client.UI.Core/Event/Constants.d.ts" />
/// <reference path="../Tooltip/Tooltip.jQuery.ts" />
/// <reference path="../ScrollView/ScrollView.jQuery.ts" />
/// <reference path="../Callout/Callout.jQuery.ts" />
/// <reference path="../ResizeTrigger/ResizeTrigger.jQuery.ts" />

module SDL.UI.Controls
{
	export interface ITabsOptions
	{
		selectedIndex?: number;
	}

	export interface ITabsProperties extends SDL.UI.Core.Controls.IControlBaseProperties
	{
		options: ITabsOptions;
	}

	interface ITabPageMutationObservers
	{
		element: HTMLElement;
		tabMutationObserver: MutationObserver;
		tabSwitchLabelMutationObserver: MutationObserver;
		tabSwitchTitleMutationObserver: MutationObserver;
	}

	interface ITabNoPageMutationObservers
	{
		element: HTMLElement;
		tabMutationObserver: MutationObserver;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
	export class TopPageTabs extends SDL.UI.Core.Controls.ControlBase
	{
		public properties: ITabsProperties;

		private $element: JQuery;
		private initialTabIndex: string;
		private $pages: JQuery;					// collection of tab pages
		private $firstOffScreenTab: JQuery;		// first off-screen tab to the right, needed for styling
		private $leftOffScreenTabs: JQuery;		// collection of off-screen tab to the left
		private $lastShownPage: JQuery;			// right-most in-screen tab, needed for styling
		private flyoutButtonMinWidth = 40;
		private tabSwitchHeight = 101;
		private flyoutMenuElement: HTMLElement;
		private flyoutMenuListElement: HTMLElement;
		private flyoutMenuPopulated: boolean;
		private flyoutMenuPositionBox: ICalloutTargetBox = { xLeft: -this.flyoutButtonMinWidth, yAbove: 0, xRight: -1, yBelow: this.tabSwitchHeight };
		private flyoutCallout: JQueryCallout;
		private flyoutScrollView: JQueryScrollView;
		private isFlyoutButtonShown: boolean = false;
		private isFlyoutMenuShown: boolean = false;
		private isFlyoutMenuHiding: boolean = false;
		private $resizeTrigger: JQuery;
		private containerMutationObserver: MutationObserver;
		private tabsPagesMutationObservers: ITabPageMutationObservers[] = [];
		private tabsNoPagesMutationObservers: ITabNoPageMutationObservers[] = [];

		private monitoring: boolean;
		private monitorTimeout: number;		// tabs control monitors changes to its tabs using the interval in IE9 and IE10, where MutationObserver is not available
		private monitorCount: number = 0;	// some changes are checked less often, after every so many iterations

		constructor(element: HTMLElement, options?: ITabsOptions)
		{
			super(element, options || {});
		}

		$initialize(): void
		{
			this.callBase("SDL.UI.Core.Controls.ControlBase", "$initialize");

			var p = this.properties;
			var $element = this.$element = SDL.jQuery(p.element);
			this.$pages = SDL.jQuery();

			p.options = SDL.jQuery.extend({}, p.options);

			this.initialTabIndex = $element.attr("tabIndex");
			$element.attr("tabIndex", this.initialTabIndex || "0")			// setting tabIndex to enable focusing the tab control, for keyboard navigation
				.addClass("sdl-tabs-container")
				.keydown(this.getDelegate(this.onKeyDown));					// keyboard navigation

			this.processHidden();
			this.processDescendants();
			this.setSelectedIndex(p.options.selectedIndex || 0);
			this.recalculate();												// process tabs contents

			this.$resizeTrigger = SDL.jQuery("<div class='sdl-tabs-resizetrigger' data-sdl-tabs-no-page='true'></div>").prependTo($element);

			$element.mousedown(this.getDelegate(this.onElementMouseDown))	// enable selection by mouse, opening flyout menu
				.scroll(this.cancelScroll);									// disable scrolling, sometimes it would scroll despite overflow being set to hidden
			if ($element.is("body"))
			{
				SDL.jQuery($element[0].ownerDocument).scroll(this.cancelScroll);	// if body is the tabs control, disable scrolling on the document
			}

			this.$resizeTrigger.resizeTrigger().resize(this.getDelegate(this.onTabsElementResize));
			if ((<any>window).MutationObserver)
			{
				this.containerMutationObserver = new (<any>MutationObserver)(this.getDelegate(this.onTabsChildrenChange));
				this.containerMutationObserver.observe(p.element, {
						childList: true
					});
			}
			else
			{
				// IE9 and IE10 don't have MutationObserver -> check changes avery 100 ms
				this.startMonitoring();
			}
		}

		public update(options?: ITabsOptions): void
		{
			if (options)
			{
				this.callBase("SDL.UI.Core.Controls.ControlBase", "update", [options]);

				var changedProperties: string[] = [];

				var selectedIndex = this.getSelectedIndex();
				if (options.selectedIndex != null && options.selectedIndex >= 0 && options.selectedIndex < this.$element.children(":not([data-sdl-tabs-no-page=true])").length)
				{
					// new selected index is specified
					if (options.selectedIndex != selectedIndex)
					{
						this.setSelectedIndex(options.selectedIndex);
						changedProperties.push("selectedIndex");
					}
				}
				else if (selectedIndex < 0)	// select first if passed index is < 0
				{
					this.selectFirst();
					changedProperties.push("selectedIndex");
				}

				for (var i = 0, len = changedProperties.length; i < len; i++)
				{
					this.fireEvent("propertychange", {property: changedProperties[i], value: (<any>options)[changedProperties[i]]});
				}
			}

			this.processChanges();
		}

		public selectNext()
		{
			var oldPage = this.$element.children(".sdl-tabs-page-selected");
			if (oldPage.length)
			{
				var next: JQuery = oldPage;
				do
				{
					next = next.next();	// select next visible tab, skipping no-page elements and hidden tabs
				} while (next.length && (next.attr("data-sdl-tabs-no-page") == "true" || !next[0].offsetWidth));

				this.updateSelection(next, oldPage);
			}
			else
			{
				this.selectFirst();
			}
		}

		public selectPrevious()
		{
			var oldPage = this.$element.children(".sdl-tabs-page-selected");
			if (oldPage.length)
			{
				var prev: JQuery = oldPage;
				do
				{
					prev = prev.prev();	// select previous visible tab, skipping no-page elements and hidden tabs
				} while (prev.length && (prev.attr("data-sdl-tabs-no-page") == "true" || !prev[0].offsetWidth));

				this.updateSelection(prev, oldPage);
			}
			else
			{
				this.selectFirst();
			}
		}

		public selectFirst()
		{
			this.setSelectedIndex(0);
		}

		public selectLast()
		{
			this.updateSelection(this.$element.children(":not([data-sdl-tabs-no-page=true])").last());
		}

		public setSelectedIndex(index: number)
		{
			this.updateSelection(this.$element.children(":not([data-sdl-tabs-no-page=true])").eq(index));
		}

		public setSelection(page: JQuery)	// set selection using a jquery object
		{
			if (page)
			{
				this.updateSelection(page.first());
			}
		}

		public setSelectedElement(page: HTMLElement)	// set selection using an html element
		{
			return this.setSelection(SDL.jQuery(page));
		}

		public getSelectedIndex()
		{
			return this.$element.children(":not([data-sdl-tabs-no-page=true])").index(this.getSelection());
		}

		public getSelection(): JQuery	// get selection as a jquery object
		{
			return this.$element.children(".sdl-tabs-page-selected");
		}

		public getSelectedElement(): HTMLElement	// get selection as an html element
		{
			return this.getSelection()[0];
		}

		private updateFlyoutButton(show: boolean, flyoutButtonWidth?: number)	// show/hide the flyout button, update the size
		{
			if (show)
			{
				if (!this.isFlyoutButtonShown)
				{
					this.$element.addClass("sdl-tabs-container-overflown");
					this.isFlyoutButtonShown = true;
				}
				var newXLeft = -(flyoutButtonWidth || this.flyoutButtonMinWidth);
				if (newXLeft != this.flyoutMenuPositionBox.xLeft)
				{
					this.flyoutMenuPositionBox.xLeft = newXLeft;
					this.positionFlyoutMenu();
				}
			}
			else if (this.isFlyoutButtonShown)
			{
				this.$element.removeClass("sdl-tabs-container-overflown sdl-tabs-container-overflown-pressed");
				if (this.isFlyoutMenuShown)
				{
					this.flyoutCallout.hide();
				}
				this.isFlyoutButtonShown = this.isFlyoutMenuShown = false;
			}
		}

		private positionFlyoutMenu()
		{
			if (this.isFlyoutMenuShown)
			{
				this.flyoutCallout.location(this.flyoutMenuPositionBox);
			}
		}

		private updateFlyoutMenuList(element?: HTMLElement, updateProperty?: string)	// populate flyout menu list
		{
			if (this.isFlyoutMenuShown)
			{
				var listElements: HTMLCollection;
				if (!this.flyoutMenuPopulated)
				{
					this.flyoutMenuPopulated = true;
				}
				else
				{
					listElements = this.flyoutMenuListElement.children;
				}

				if (listElements && element)
				{
					this.updateMenuItem(<HTMLElement>listElements[this.$pages.index(element)], element, updateProperty);
				}
				else
				{
					var skippedPagesCount = 0;
					this.$pages.each((index: number, element: HTMLElement) =>
						{
							if (element.offsetWidth)
							{
								var item = listElements
									? <HTMLElement>listElements[index - skippedPagesCount]
									: SDL.jQuery("<div><div></div><span></span></div>")
										.attr("data-sdl-tabs-page-index", index)
										.appendTo(this.flyoutMenuListElement)[0];

								this.updateMenuItem(item, element);
							}
							else
							{
								skippedPagesCount++;
							}
						});
				}
			}
		}

		private updateMenuItem(item: HTMLElement, tab: HTMLElement, updateProperty?: string)
		{
			var selected: boolean = !updateProperty || updateProperty == "icon" || updateProperty == "selection"
					? tab.className.indexOf("sdl-tabs-page-selected") != -1 : null;

			var titleElement: HTMLElement = <HTMLElement>tab.firstElementChild;
			var labelElement: HTMLElement;
			if (titleElement && titleElement.getAttribute("data-sdl-tabs-switch-label"))
			{
				labelElement = titleElement;
				titleElement = <HTMLElement>titleElement.nextElementSibling;
			}

			if (!updateProperty || updateProperty == "icon" || updateProperty == "selection")
			{
				// class for the icon is specified using element's attributes: data-sdl-tabs-menu-icon-class-bright and data-sdl-tabs-menu-icon-class-dark
				var flyoutMenuIconStyle: string = labelElement && labelElement.getAttribute(selected
															? "data-sdl-tabs-menu-icon-class-bright"
															: "data-sdl-tabs-menu-icon-class-dark") || "";
				if (flyoutMenuIconStyle
					? (<HTMLElement>item.firstElementChild).className != flyoutMenuIconStyle
					: <any>(<HTMLElement>item.firstElementChild).className)
				{
					(<HTMLElement>item.firstElementChild).className = flyoutMenuIconStyle || "";
				}
			}

			if (!updateProperty || updateProperty == "text")
			{
				var title = titleElement ? titleElement.textContent : "";
				if (item.lastElementChild.textContent != title)
				{
					item.lastElementChild.textContent = title;
				}
			}

			if (!updateProperty || updateProperty == "selection")
			{
				if (selected)
				{
					if (item.className.indexOf("sdl-tabs-page-selected") < 0)
					{
						SDL.jQuery(item).addClass("sdl-tabs-page-selected");
					}
				}
				else if (item.className.indexOf("sdl-tabs-page-selected") != -1)
				{
					SDL.jQuery(item).removeClass("sdl-tabs-page-selected");
				}
			}
		}

		private invalidateFlyoutMenu()
		{
			if (this.flyoutMenuListElement)
			{
				this.flyoutMenuPopulated = false;
				this.flyoutMenuListElement.textContent = "";	// remove items from the flyout menu list
				this.updateFlyoutMenuList();
			}
		}

		private setFlyoutMenuListDimensions()
		{
			if (this.isFlyoutMenuShown)
			{
				var scrollElement: HTMLElement = <HTMLElement>this.flyoutMenuElement.firstElementChild;
				var listElements: HTMLCollection = this.flyoutMenuListElement.children;

				scrollElement.style.maxHeight = ((<HTMLElement>(document.documentElement || document.body.parentNode || document.body)).offsetHeight - 14) + "px";	// limit the height to the window's height - paddings (2 * 6) - borders (2 * 1)
				scrollElement.style.height = (listElements.length * 36) + "px";		// calculate the actual height

				var scrollWidth: number = 0;
				for (var i = 0, len = listElements.length; i < len; i++)
				{
					scrollWidth = Math.max(scrollWidth, listElements[i].scrollWidth);	// get the width of the longest title
				}
				scrollElement.style.width = scrollWidth + "px";
			}
		}

		private scrollToFlyoutMenuSelection()
		{
			if (this.isFlyoutMenuShown)
			{
				var listElement: HTMLElement = this.flyoutMenuListElement;
				var selected = SDL.jQuery(".sdl-tabs-page-selected", listElement)[0];
				if (selected)
				{
					// scroll to the selected item in the flyout menu list, if the selected item is off screen
					var top = selected.offsetTop;
					if (listElement.scrollTop > top)
					{
						listElement.scrollTop = top;
					}
					else if (listElement.scrollTop < (top - listElement.clientHeight + 36))
					{
						listElement.scrollTop = (top - listElement.clientHeight + 36);
					}
				}
			}
		}

		private showFlyoutMenu()
		{
			if (this.isFlyoutButtonShown && !this.isFlyoutMenuShown)
			{
				this.isFlyoutMenuShown = true;
				if (!this.flyoutMenuElement)
				{
					// create flyout menu element as a child of the body
					var $flyoutMenu = SDL.jQuery("<div class='sdl-tabs-flyout-menu'><div><div data-sdl-scrollview-child='true'></div></div></div>")
						.appendTo(document.body);
					this.flyoutMenuElement = $flyoutMenu[0];
					this.flyoutMenuListElement = <HTMLElement>this.flyoutMenuElement.firstElementChild.firstElementChild;

					SDL.jQuery(this.flyoutMenuListElement).mousedown(this.getDelegate(this.onFlyoutMouseDown));	// enable selecting items with mouse
					$flyoutMenu.keydown(this.getDelegate(this.onKeyDown));	// keyboard support in the flyout menu list

					// create callout control
					this.flyoutCallout = $flyoutMenu.callout({
						targetElement: this.properties.element,
						preferredPosition: <any>[CalloutPosition.BELOW, CalloutPosition.RIGHT, CalloutPosition.ABOVE],
						purpose: CalloutPurpose.MENU,
						visible: false });
					this.flyoutCallout.on("hide", this.getDelegate(this.onFlyoutHide));

					// create a scrollview in the callout
					this.flyoutScrollView = SDL.jQuery(this.flyoutMenuElement.firstElementChild).scrollView({ overflowX: "hidden" });
				}
				
				this.$element.addClass("sdl-tabs-container-overflown-pressed");		
				this.updateFlyoutMenuList();			// populate the list
				this.setFlyoutMenuListDimensions();		// set the size of the list element
				this.positionFlyoutMenu();				// set position of the callout
				this.flyoutCallout.show();				// show the callout
				this.scrollToFlyoutMenuSelection();		// ensure the selected item is in screen
			}
		}

		private hideFlyoutMenu()
		{
			if (this.isFlyoutMenuShown)
			{
				this.flyoutCallout.hide();
			}
		}

		private processHidden()	// detect all tab pages that are hidden, set sdl-tabs-page-hidden attribute, needed for styling
		{
			var changed = false;
			var lastShownPage: HTMLElement;
			SDL.jQuery.each(this.properties.element.children, (index: number, child: HTMLElement) =>
				{
					if (!child.offsetWidth)	// hidden tab -> mark it with the corresponding class name for correct styling of the next sibling tab switch
					{
						if (child.getAttribute("data-sdl-tabs-no-page") != "true" &&
							child.className.indexOf("sdl-tabs-page-hidden") < 0)		// this is for optimization, supposed to be faster than jQuery's addClass
						{
							SDL.jQuery(child).addClass("sdl-tabs-page-hidden");
							changed = true;
						}
					}
					else
					{
						if (child.getAttribute("data-sdl-tabs-no-page") != "true")
						{
							lastShownPage = child;
							if (child.className.indexOf("sdl-tabs-page-hidden") >= 0)	// this is for optimization, supposed to be faster than jQuery's removeClass
							{
								SDL.jQuery(child).removeClass("sdl-tabs-page-hidden");
								changed = true;
							}
						}
						else
						{
							lastShownPage = null;
						}
					}
				});

			if (!lastShownPage != !this.$lastShownPage ||
				lastShownPage && lastShownPage != this.$lastShownPage[0])
			{
				if (this.$lastShownPage)
				{
					this.$lastShownPage.removeClass("sdl-tabs-page-last");
				}

				if (lastShownPage)
				{
					this.$lastShownPage = SDL.jQuery(lastShownPage).addClass("sdl-tabs-page-last");
				}
				else
				{
					this.$lastShownPage = null;
				}
			}
			return changed;
		}

		private processDescendants()	// check if DOM elements have been added/removed inside the control
		{
			var i: number;
			var len: number;
			var $children = this.$element.children(":not([data-sdl-tabs-no-page=true])");
			var $addedPages = $children.not(this.$pages);
			var $removedPages = this.$pages.not($children);

			var changed = false;

			if ($addedPages.length || $removedPages.length)
			{
				if ((<any>window).MutationObserver)
				{
					var tabsMutationObservers = this.tabsPagesMutationObservers;
					for (i = 0; i < $removedPages.length; i++)
					{
						for (var j = 0; j < tabsMutationObservers.length; j++)
						{
							var tabMutationObservers: ITabPageMutationObservers = tabsMutationObservers[j];
							if (tabMutationObservers.element == $removedPages[i])
							{
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
					for (i = 0; i < $addedPages.length; i++)
					{
						var tabMutationObservers: ITabPageMutationObservers = <ITabPageMutationObservers>{
								element: $addedPages[i],
								tabMutationObserver: new (<any>MutationObserver)(onPageAttributeChangeDelegate),
								tabSwitchLabelMutationObserver: new (<any>MutationObserver)(onPageSwitchLabelChangeDelegate),
								tabSwitchTitleMutationObserver: new (<any>MutationObserver)(onPageSwitchTitleChangeDelegate)
							};
						tabsMutationObservers.push(tabMutationObservers);

						// monitor the page itself, react if it becomes hidden or selected
						tabMutationObservers.tabMutationObserver.observe($addedPages[i], {
								attributes: true,
								attributeFilter: ["class", "style"]
							});

						// monitor the page label if found, need for the flyout menu icon
						var titleElement = $addedPages[i].firstElementChild;
						if (titleElement && titleElement.hasAttribute("data-sdl-tabs-switch-label"))
						{
							tabMutationObservers.tabSwitchLabelMutationObserver.observe(titleElement, {
									attributes: true,
									attributeFilter: ["data-sdl-tabs-menu-icon-class-bright", "data-sdl-tabs-menu-icon-class-dark"]
								});
							titleElement = titleElement.nextElementSibling;
						}

						// monitor the page title, need for the flyout menu label
						if (titleElement)
						{
							tabMutationObservers.tabSwitchTitleMutationObserver.observe(titleElement, {
									characterData: true,
									subtree: true
								});
						}
					}
				}

				$removedPages.removeClass("sdl-tabs-page-selected")
					.children(":first-child, :first-child[data-sdl-tabs-switch-label] + *").tooltip().dispose();
				$addedPages.children(":first-child, :first-child[data-sdl-tabs-switch-label] + *")
					.tooltip({showIfNoOverflow: false, trackMouse: true, relativeTo: "mouse", showWhenCursorStationary: true});
				changed = true;
			}
			else
			{
				for (i = 0, len = $children.length - 1; i < len; i++)	// checking if tabs changed positions -> no need to check the last one
				{
					if ($children[i] != this.$pages[i])
					{
						changed = true;
						break;
					}
				}
			}
			this.$pages = $children;

			if ((<any>window).MutationObserver)
			{
				for (i = this.tabsNoPagesMutationObservers.length - 1; i >= 0 ; i--)
				{
					var noPageElement = this.tabsNoPagesMutationObservers[i].element;
					if (noPageElement.parentElement != this.properties.element || noPageElement.getAttribute("data-sdl-tabs-no-page") != "true")
					{
						this.tabsNoPagesMutationObservers[i].tabMutationObserver.disconnect();
						this.tabsNoPagesMutationObservers.splice(i, 1);
					}
				}

				var resizeTrigger = this.$resizeTrigger && this.$resizeTrigger[0];
				var onNoPageChangeDelegate = this.getDelegate(this.onNoPageChange);
				this.$element.children("[data-sdl-tabs-no-page=true]").each((i: number, noPageElement: HTMLElement) =>
				{
					if (noPageElement != resizeTrigger)
					{
						var tabsNoPagesMutationObservers = this.tabsNoPagesMutationObservers;
						for (i = tabsNoPagesMutationObservers.length - 1; i >= 0 ; i--)
						{
							var tabNoPageElement = this.tabsNoPagesMutationObservers[i].element;
							if (tabNoPageElement.parentElement == noPageElement)
							{
								return;
							}
						}

						// need to set mutation observer for no-page tabs to detect changes in dimensions
						var tabMutationObservers: ITabNoPageMutationObservers = <ITabNoPageMutationObservers>{
								element: noPageElement,
								tabMutationObserver: new (<any>MutationObserver)(onNoPageChangeDelegate)
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
		}

		private recalculate()		// if dimentions have changed, update overflow button if needed, ensure the selected tab is in  screen
		{
			var element = this.properties.element;
			if (element.offsetHeight && element.offsetWidth)	// if element is hidden -> no need to recalculate, skip
			{
				var resizeTriggerElement = this.$resizeTrigger && this.$resizeTrigger[0];
				var tab: HTMLElement = <HTMLElement>element.firstElementChild;
				var availableWidth = element.clientWidth;

				var remainingWidth = availableWidth;
				while (tab)
				{
					if (tab != resizeTriggerElement)
					{
						remainingWidth -= (tab.offsetWidth || 0);
						if (remainingWidth < 0)
						{
							break;
						}
					}
					tab = <HTMLElement>tab.nextElementSibling;
				}

				if (remainingWidth >= 0)	// all tabs fit in the available width
				{
					if (this.$leftOffScreenTabs)
					{
						this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
						this.$leftOffScreenTabs = null;
					}
					if (this.$firstOffScreenTab)
					{
						this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
						this.$firstOffScreenTab = null;
					}
					this.updateFlyoutButton(false);
				}
				else						// not all tabs fit in the available width
				{
					availableWidth -= (this.flyoutButtonMinWidth - 1);		// width_of_flyout_button - border

					// ensure selected tab is in screen
					var rightAlignedTab = this.getSelectedElement();

					if (rightAlignedTab && rightAlignedTab.offsetWidth)
					{
						if (rightAlignedTab.offsetTop == 0 &&
								(rightAlignedTab.offsetLeft + rightAlignedTab.offsetWidth <= availableWidth))
						{
							// selected tab is in screen -> keep currently last in-screen tab right-aligned
							tab = rightAlignedTab;
							remainingWidth = availableWidth - tab.offsetLeft;
							rightAlignedTab = null;
						}
					}
					else
					{
						// no selected tab or it is hidden -> we'll keep currently last in-screen tab right-aligned
						tab = <HTMLElement>element.firstElementChild;
						remainingWidth = availableWidth;
						rightAlignedTab = null;
					}

					if (!rightAlignedTab)	// current selection does not have to be aligned to the right, find the last in screen tab and keep it right aligned
					{
						do
						{
							while (tab && (!tab.offsetWidth || tab == resizeTriggerElement))
							{
								tab = <HTMLElement>tab.nextElementSibling;	// skip hidden tabs
							}

							if (!tab)
							{
								break;
							}
							else
							{
								remainingWidth -= tab.offsetWidth;
								if (remainingWidth >= 0)
								{
									rightAlignedTab = tab;
									tab = <HTMLElement>tab.nextElementSibling;
								}
								else
								{
									break;
								}
							}
						} while (1);
					}
					//else
					//{
						// if selection is off-screen, then show it right-aligned
					//}

					// determine what leftmost tabs will not fit the available width if the rightAlignedTab tab is right-aligned
					availableWidth -= rightAlignedTab.offsetWidth;
					tab = <HTMLElement>rightAlignedTab.previousElementSibling;
					if (availableWidth > 0)
					{
						remainingWidth = availableWidth;
						while (tab)	// skip tabs that will fit the available width when the rightAlignedTab tab is right-aligned
						{
							if (tab != resizeTriggerElement)
							{
								remainingWidth -= (tab.offsetWidth || 0);
								if (remainingWidth < 0)
								{
									break;
								}
								else
								{
									availableWidth = remainingWidth;
								}
							}
							tab = <HTMLElement>tab.previousElementSibling;
						}
					}

					var leftOffScreenTabs: HTMLElement[] = tab ? [] : null;
					while (tab)	// collect tabs that will be off-screen to the left
					{
						if (tab != resizeTriggerElement)
						{
							leftOffScreenTabs.push(tab);
						}
						tab = <HTMLElement>tab.previousElementSibling;
					}

					// select following sibling tab that will be the first off-screen on the right
					tab = <HTMLElement>rightAlignedTab.nextElementSibling;

					var firstOffScreenTab: HTMLElement;
					remainingWidth = availableWidth;
					while (tab && !firstOffScreenTab)
					{
						if (tab != resizeTriggerElement)
						{
							remainingWidth -= (tab.offsetWidth || 0);
							if (remainingWidth < 0)
							{
								firstOffScreenTab = tab;
							}
							else
							{
								availableWidth = remainingWidth;
							}
						}
						tab = <HTMLElement>tab.nextElementSibling;
					};

					if (leftOffScreenTabs && leftOffScreenTabs.length)
					{
						var $leftOffScreenTabs = SDL.jQuery(leftOffScreenTabs);
						if (this.$leftOffScreenTabs)
						{
							this.$leftOffScreenTabs.not(leftOffScreenTabs).removeClass("sdl-tabs-tab-left-off-screen");
							$leftOffScreenTabs.not(this.$leftOffScreenTabs).addClass("sdl-tabs-tab-left-off-screen");
						}
						else
						{
							$leftOffScreenTabs.addClass("sdl-tabs-tab-left-off-screen");
						}
						this.$leftOffScreenTabs = $leftOffScreenTabs;
					}
					else if (this.$leftOffScreenTabs)
					{
						this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
						this.$leftOffScreenTabs = null;
					}

					if (!this.$firstOffScreenTab != !firstOffScreenTab ||
						firstOffScreenTab && firstOffScreenTab != this.$firstOffScreenTab[0])
					{
						if (this.$firstOffScreenTab)
						{
							this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
						}

						if (firstOffScreenTab)
						{
							this.$firstOffScreenTab = SDL.jQuery(firstOffScreenTab).addClass("sdl-tabs-tab-first-off-screen");
						}
						else
						{
							this.$firstOffScreenTab = null;
						}
					}

					this.updateFlyoutButton(true, availableWidth + this.flyoutButtonMinWidth);
				}
			}
		}

		private onElementMouseDown(e: JQueryEventObject)
		{
			if (e.which == 1)
			{
				if (e.target == this.properties.element)	// event happened on the element itself, the flyout button area
				{
					if (!this.isFlyoutMenuShown &&
						(e.offsetY || (<any>e.originalEvent).layerY || 0) < this.tabSwitchHeight)	// event happened on the flyout button area
					{
						this.showFlyoutMenu();
					}
				}
				else
				{
					var $targetPage = SDL.jQuery(e.target).closest(this.$element.children(":not([data-sdl-tabs-no-page=true])"));
					if ($targetPage.length)	// mousedown is on a tab switch
					{
						// IE workaround: focus is put in an element in side a tab switch even if there's no tabIndex specified
						// -> have to reset to the tabs element itself for proper :focus styling
						var firstChild: Element;
						if (e.target == $targetPage[0] || e.target == (firstChild = $targetPage[0].firstElementChild) ||
							(firstChild.hasAttribute("data-sdl-tabs-switch-label") &&
								(e.target == firstChild.nextElementSibling || SDL.jQuery.contains(firstChild.nextElementSibling, <HTMLElement>e.target))) ||
							SDL.jQuery.contains(firstChild, <HTMLElement>e.target))
						{
							// mouse down was on an element in the tab switch -> check after the event what element gets focus
							setTimeout(() =>
							{
								// in IE the focus is placed in a label in the tab switch -> need to set focus to the control element
								if (document.activeElement != this.properties.element && document.activeElement == $targetPage[0] || document.activeElement == (firstChild = $targetPage[0].firstElementChild) ||
									(firstChild.hasAttribute("data-sdl-tabs-switch-label") &&
										(document.activeElement == firstChild.nextElementSibling || SDL.jQuery.contains(firstChild.nextElementSibling, document.activeElement))) ||
									SDL.jQuery.contains(firstChild, document.activeElement))
								{
									this.$element.focus();
								}
							});
						}
						// end of workaround

						this.updateSelection($targetPage);	// select the corresponding tab page
					}
				}
			}
		}

		private onFlyoutMouseDown(e: JQueryEventObject)
		{
			if (e.which == 1)
			{
				var target = <HTMLElement>e.target;
				var index: number = <any>(target.hasAttribute("data-sdl-tabs-page-index")
					? target.getAttribute("data-sdl-tabs-page-index")
					: target.parentElement.getAttribute("data-sdl-tabs-page-index"));

				if (index != null)
				{
					this.setSelectedIndex(index);
					this.hideFlyoutMenu();
				}
			}
		}

		private onFlyoutHide()
		{
			if (this.isFlyoutMenuShown)
			{
				this.isFlyoutMenuShown = false;
				this.$element.removeClass("sdl-tabs-container-overflown-pressed");
			}
		}

		private onKeyDown(e: JQueryEventObject)
		{
			if (!e.ctrlKey && !e.shiftKey &&
				(this.isFlyoutMenuShown ||
					document.activeElement == this.properties.element))	// handle keyboard events only if the tab control element itself has the focus (to ensure consistency with :focus style)
			{
				var handled = false;
				switch (e.which)
				{
					case SDL.UI.Core.Event.Constants.Keys.LEFT:
						this.selectPrevious();
						handled = true;
						break;
					case SDL.UI.Core.Event.Constants.Keys.RIGHT:
						this.selectNext();
						handled = true;
						break;
					case SDL.UI.Core.Event.Constants.Keys.HOME:
						this.selectFirst();
						handled = true;
						break;
					case SDL.UI.Core.Event.Constants.Keys.END:
						this.selectLast();
						handled = true;
						break;
					case SDL.UI.Core.Event.Constants.Keys.UP:
						if (this.isFlyoutMenuShown)
						{
							this.selectPrevious();
							handled = true;
						}
						break;
					case SDL.UI.Core.Event.Constants.Keys.DOWN:
						if (this.isFlyoutMenuShown)
						{
							this.selectNext();
							handled = true;
						}
						break;
					case SDL.UI.Core.Event.Constants.Keys.ENTER:
						this.hideFlyoutMenu();
						e.stopImmediatePropagation();
						e.preventDefault();
						break;
				}

				if (handled)
				{
					e.stopImmediatePropagation();
					e.preventDefault();
					this.scrollToFlyoutMenuSelection();
				}
			}
		}

		private cancelScroll(e: JQueryEventObject)
		{
			var element = <HTMLElement>e.target;
			if (element.nodeType == 9)	// document -> reset both documentElement (FF and IE) and body (Chrome)
			{
				var html = (<Document><any>element).documentElement;
				html.scrollLeft = html.scrollTop = 0;

				element = (<Document><any>element).body;
			}
			element.scrollLeft = element.scrollTop = 0;
		}

		private updateSelection(newPage: JQuery, oldPage?: JQuery): void
		{
			if (newPage.length && !newPage.attr("data-sdl-tabs-no-page") && newPage.parent().is(this.$element) &&
					newPage[0].offsetWidth)	// select only if tab page is not hidden
			{
				if (!oldPage)
				{
					oldPage = this.$element.children(".sdl-tabs-page-selected");
				}

				if (newPage[0] != oldPage[0])
				{
					oldPage.removeClass("sdl-tabs-page-selected");
					newPage.addClass("sdl-tabs-page-selected");

					oldPage.each((index: number, element: HTMLElement) => this.updateFlyoutMenuList(element, "selection"));
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
		}

		private onTabsElementResize()
		{
			this.stopMonitoring();
			this.recalculate();
			this.resumeMonitoring();
		}

		private onTabsChildrenChange()
		{
			var changed = this.processHidden();
			changed = this.processDescendants() || changed;
			if (changed)
			{
				// list of pages changed -> need to invalidate the flyout menu
				this.invalidateFlyoutMenu();
			}

			// tabs (page or no page) were added/removed -> need recalculate dimensions
			this.recalculate();
		}

		private onPageAttributeChange(changes: MutationRecord[])
		{
			// the page might have become hidden/shown and/or selected -> need recalculate and update flyout menu list
			var menuInvalidate = this.processHidden();
			if (menuInvalidate)
			{
				// pages were hidden or shown -> need to invalidate the flyout menu
				this.invalidateFlyoutMenu();
			}

			this.recalculate();

			if (!menuInvalidate)
			{
				for (var i = 0; i < changes.length; i++)
				{
					var change = changes[i];
					if (change.type == "attributes")
					{
						if (change.attributeName == "class")	// a tab might have been selected/unselected
						{
							// ensure the flyout out menu list is up to date
							this.updateFlyoutMenuList(<HTMLElement>change.target, "selection");
						}
					}
				}
			}
		}

		private onPageSwitchLabelChange(changes: MutationRecord[])
		{
			for (var i = 0; i < changes.length; i++)
			{
				var change = changes[i];
				if (change.type == "attributes")
				{
					var selected = (<HTMLElement>change.target.parentNode).className.indexOf("sdl-tabs-page-selected") != -1;
					if ((change.attributeName == "data-sdl-tabs-menu-icon-class-bright" && selected) ||
						(change.attributeName == "data-sdl-tabs-menu-icon-class-dark" && !selected))
					{
						// menu icon has changed -> update the menu
						this.updateFlyoutMenuList(<HTMLElement>change.target.parentNode, "icon");
					}
				}
			}
		}

		private onPageSwitchTitleChange(changes: MutationRecord[])
		{
			for (var i = 0; i < changes.length; i++)
			{
				var change = changes[i];
				if (change.type == "characterData")
				{
					// tab's title has changed -> update the menu
					this.updateFlyoutMenuList(SDL.jQuery(change.target).closest(this.$pages)[0], "text");
				}
			}
		}

		private onNoPageChange()
		{
			// 'no-page' tab changed, might result in changed dimensions -> recalculate
			this.recalculate();
		}

		private processChanges()
		{
			if (this.monitoring)
			{
				this.stopMonitoring();

				var changed = this.processHidden();
				if (changed || ++this.monitorCount == 2)		// processing descendants every 2nd iteration (every 1 second)
				{
					this.monitorCount = 0;
					changed = this.processDescendants() || changed;

					if (changed)
					{
						this.invalidateFlyoutMenu();	// tabs were added/removed/shown/hidden -> invalidate the flyout menu
					}
					else
					{
						this.updateFlyoutMenuList();	// no change detected, text/icons might still have changed -> update the flyout menu in that case
					}
				}

				this.recalculate();	// always recaculate as contents might have changed because of 'no-tab' pages changing their dimensions

				this.resumeMonitoring();
			}
		}

		private startMonitoring()
		{
			this.monitoring = true;
			this.monitorTimeout = setTimeout(this.getDelegate(this.processChanges), 500);
		}

		private stopMonitoring()
		{
			if (this.monitorTimeout)
			{
				clearTimeout(this.monitorTimeout);
				this.monitorTimeout = null;
			}
		}

		private resumeMonitoring()
		{
			if (this.monitoring)
			{
				this.monitorTimeout = setTimeout(this.getDelegate(this.processChanges), 500);
			}
		}

		private cleanUp()
		{
			var $element = this.$element;
			var options: ITabsOptions = this.properties.options;

			if (this.monitorTimeout)
			{
				this.stopMonitoring();
				this.monitorTimeout = null;
			}

			if (this.$resizeTrigger)
			{
				(<JQueryResizeTrigger>this.$resizeTrigger.resizeTrigger()).dispose().remove();
				this.$resizeTrigger = null;
			}

			if (this.containerMutationObserver)
			{
				this.containerMutationObserver.disconnect();
				this.containerMutationObserver = null;
			}

			if (this.tabsPagesMutationObservers)
			{
				for (var i = 0; i < this.tabsPagesMutationObservers.length; i++)
				{
					var tabMutationObservers = this.tabsPagesMutationObservers[i];
					tabMutationObservers.tabMutationObserver.disconnect();
					tabMutationObservers.tabSwitchLabelMutationObserver.disconnect();
					tabMutationObservers.tabSwitchTitleMutationObserver.disconnect();
				}
				this.tabsPagesMutationObservers = null;
			}

			if (this.tabsNoPagesMutationObservers)
			{
				for (var i = 0; i < this.tabsNoPagesMutationObservers.length; i++)
				{
					this.tabsNoPagesMutationObservers[i].tabMutationObserver.disconnect();
				}
				this.tabsNoPagesMutationObservers = null;
			}

			$element.removeClass("sdl-tabs-container sdl-tabs-container-overflown sdl-tabs-container-overflown-pressed").off("scroll", this.cancelScroll);
			if ($element.is("body"))
			{
				SDL.jQuery($element[0].ownerDocument).off("scroll", this.cancelScroll);
			}

			this.$pages.removeClass("sdl-tabs-page-selected sdl-tabs-page-hidden")
				.children(":first-child, :first-child[data-sdl-tabs-switch-label] + *").tooltip().dispose();

			if (this.$firstOffScreenTab)
			{
				this.$firstOffScreenTab.removeClass("sdl-tabs-tab-first-off-screen");
				this.$firstOffScreenTab = null;
			}

			if (this.$lastShownPage)
			{
				this.$lastShownPage.removeClass("sdl-tabs-page-last");
				this.$lastShownPage = null;
			}

			if (this.$leftOffScreenTabs)
			{
				this.$leftOffScreenTabs.removeClass("sdl-tabs-tab-left-off-screen");
				this.$leftOffScreenTabs = null;
			}

			var elementMouseDownDelegate = this.removeDelegate(this.onElementMouseDown);
			if (elementMouseDownDelegate)
			{
				this.$element.off("mousedown", elementMouseDownDelegate)
			}

			var keyDownDelegate = this.removeDelegate(this.onKeyDown);
			if (keyDownDelegate)
			{
				this.$element.off("keydown", keyDownDelegate);
			}

			if (this.flyoutMenuElement)
			{
				var flyoutMouseDownDelegate = this.removeDelegate(this.onFlyoutMouseDown);
				if (flyoutMouseDownDelegate)
				{
					SDL.jQuery(this.flyoutMenuListElement).off("mousedown", flyoutMouseDownDelegate)
				}

				var flyoutHideDelegate = this.removeDelegate(this.onFlyoutHide);
				if (flyoutHideDelegate)
				{
					this.flyoutCallout.off("hide", flyoutHideDelegate);
				}

				if (keyDownDelegate)
				{
					SDL.jQuery(this.flyoutMenuElement).off("keydown", keyDownDelegate);
				}

				this.flyoutScrollView.dispose();
				this.flyoutCallout.dispose();
				document.body.removeChild(this.flyoutMenuElement);
				this.flyoutMenuElement = this.flyoutMenuListElement = this.flyoutCallout = this.flyoutScrollView = null;
			}

			if (!this.initialTabIndex)
			{
				$element.removeAttr("tabIndex");
			}
			else
			{
				$element.attr("tabIndex", this.initialTabIndex);
			}

			this.$element = this.$pages = null;
		}
	}

	TopPageTabs.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$UI$Controls$TopPageTabs$disposeInterface()
	{
		this.cleanUp();
	});

	SDL.Client.Types.OO.createInterface("SDL.UI.Controls.TopPageTabs", TopPageTabs);
} 