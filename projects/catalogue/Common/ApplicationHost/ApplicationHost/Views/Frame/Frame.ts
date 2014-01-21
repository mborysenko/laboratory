/// <reference path="..\..\ViewModels\Navigation.ts" />
/// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.Core\Types\Object.d.ts" />
/// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.UI.Core\Views\ViewBase.d.ts" />
/// <reference path="..\..\..\..\..\SDL.Client\SDL.Client.UI.Core.Knockout\ViewModels\ViewModelBase.d.ts" />

module SDL.Client.UI.ApplicationHost.Views
{
	import Navigation = SDL.Client.UI.ApplicationHost.ViewModels.Navigation;

	export interface IFrameViewModel extends SDL.UI.Core.Knockout.ViewModels.ViewModelBase
	{
		initialized: KnockoutObservable<boolean>;
		navigationGroups: Navigation.INavigationGroup[];
		visitedNavigationGroups: KnockoutObservableArray<Navigation.INavigationGroup>;
		currentNavigationItem: KnockoutObservable<Navigation.INavigationItem>;
		currentNavigationGroup: KnockoutObservable<Navigation.INavigationGroup>;
		navigationPaneShown: KnockoutObservable<boolean>;
		navigationPaneToggleShown: KnockoutComputed<boolean>;
		expandedNavigationGroup: KnockoutObservable<Navigation.INavigationGroup>;
		navigationItemTargetDisplays: Navigation.INavigationItemTargetDisplay[];
		authenticationTargetDisplays: Navigation.IAuthenticationTargetDisplay[];
		topNavigationGroup: Navigation.INavigationGroup;
		homeNavigationItem: Navigation.INavigationItem;
		shownTargetDisplay: KnockoutComputed<Navigation.ITargetDisplay>;
		toggleNavigationPane: () => void;
		selectNavigationItem: (item: Navigation.INavigationItem) => void;
		selectNavigationGroup: (group: Navigation.INavigationGroup) => void;
		toggleExpandNavigationGroup: (group: Navigation.INavigationGroup) => void;
		onNavigationSelectionChanged: KnockoutComputed<void>;
		onExpandedNavigationGroupChanged: KnockoutSubscription;
		blurredNavigationPane: () => void;
		setTargetDisplayLocation: (targetDisplay: Navigation.INavigationItemTargetDisplay, node: Node) => void;
		animateLoadingFeedback: (element: HTMLElement) => void;
		initCustomScroll: (customScrollWrapper: HTMLElement) => void;
		getNavigationItemName: (item: Navigation.INavigationItem) => string;
		getNavigationGroupName: (item: Navigation.INavigationGroup) => string;
		registerTargetDisplayFrame: (targetDisplay: Navigation.ITargetDisplay, frame: HTMLIFrameElement) => void;
	}

	eval(SDL.Client.Types.OO.enableCustomInheritance);
    export class Frame extends SDL.UI.Core.Views.ViewBase
	{
		private scrollHeightMonitorInterval: number;
		private model: IFrameViewModel;
		private initialized: KnockoutObservable<boolean> = ko.observable(false);
		private updateTitleBar: KnockoutComputed<void>;

        getRenderOptions()
		{
			var model: IFrameViewModel = this.model = <any>new SDL.UI.Core.Knockout.ViewModels.ViewModelBase();

			model.initialized = this.initialized;
			model.visitedNavigationGroups = ko.observableArray([]);
			model.toggleNavigationPane = function()
			{
				model.navigationPaneShown(!model.navigationPaneShown());
			};

			model.selectNavigationItem = function(item: Navigation.INavigationItem)
			{
				Navigation.selectNavigationItem(item);
			};

			model.selectNavigationGroup = function(group: Navigation.INavigationGroup)
			{
				Navigation.currentNavigationGroup(group);
			};

			model.toggleExpandNavigationGroup = function(group: Navigation.INavigationGroup)
			{
				if (model.expandedNavigationGroup() != group)
				{
					model.expandedNavigationGroup(group);
				}
				else
				{
					var groupsCount = 0;
					for (var i = 0, len = model.navigationGroups.length; i < len; i++)
					{
						var group = model.navigationGroups[i];
						if (group.shownItems())
						{
							if (groupsCount)
							{
								model.expandedNavigationGroup(null);	// more than 1 groups have items -> can collapse
								return;
							}
							groupsCount++;
						}
					}
				}
			};

			model.blurredNavigationPane = function()
			{
				if (model.navigationPaneShown())
				{
					var currentNavigationItem = Navigation.currentNavigationItem();
					if (currentNavigationItem
						? (currentNavigationItem.type != "home" ||
							currentNavigationItem.navigationGroup.authenticationTargetDisplay && currentNavigationItem.navigationGroup.authenticationTargetDisplay())
						: Navigation.currentNavigationGroup() != null)
					{
						model.navigationPaneShown(false);
					}
				}
			};

			model.setTargetDisplayLocation = function(targetDisplay: Navigation.INavigationItemTargetDisplay, node: Node)
			{
				if (targetDisplay.navigationItem)
				{
					var item = targetDisplay.navigationItem();
					var src = (!item || item.hidden()) ? "about:blank" : item.src();
					if (targetDisplay.src != src)
					{
						var frame = <HTMLIFrameElement>SDL.jQuery(node).prev("div").find("iframe")[0];
						if (src != "about:blank")
						{
							var urlChange = Types.Url.makeRelativeUrl(targetDisplay.src, src);
							if (urlChange && urlChange.charAt(0) != "#")
							{
								// change is more than just a hash
								targetDisplay.loaded(false);
							}
						}

						try
						{
							frame.contentWindow.location.replace(src);
						}
						catch (err)
						{
							frame.src = src;
						}
						targetDisplay.src = src;
					}
				}
			};

			model.animateLoadingFeedback = function(element: HTMLElement)
			{
				// IE9 does not support animation -> use javascript
				if (element.style.animation == undefined && (<any>element.style).webkitAnimation == undefined)
				{
					var position = 0;
					var step = 12;
					var interval = window.setInterval(function()
						{
							position += step;
							if (position >= 360)
							{
								position -= 360;
							}
							element.style.msTransform = "rotate(" + position + "deg)";
						}, 30);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function()
					{
						window.clearInterval(interval);
					});
				}
			}

			model.initCustomScroll = (customScrollWrapper: HTMLElement) =>
			{
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
				var handleSpaceCorrection = 0;		// actual size of the scroll bar handle can't be smaller than a certain minimum,
													// handleSpaceCorrection stores the difference between the calculated size and the actual size
				var scrollShown = true;

				function adjustHeight()
				{
					if (customScrollContent.offsetHeight != realScrollContent.offsetHeight || customScrollArea.offsetHeight != customScrollAreaOffsetHeight)
					{
						customScrollAreaOffsetHeight = customScrollArea.offsetHeight;
						if (customScrollContent.offsetHeight != realScrollContent.offsetHeight)
						{
							customScrollContent.style.height = realScrollContent.offsetHeight + "px";
						}

						var ratio = customScrollAreaOffsetHeight / realScrollContent.offsetHeight;

						if (ratio >= 1)
						{
							if (scrollShown)
							{
								scrollShown = false;
								$customScrollWrapper.addClass("frame-navigation-scroll-wrapper-hidden");
							}
						}
						else
						{
							if (!scrollShown)
							{
								scrollShown = true;
								$customScrollWrapper.removeClass("frame-navigation-scroll-wrapper-hidden");
							}

							var height = (customScrollAreaOffsetHeight - barBtnHeight * 2) * ratio;
							if (height < 10)
							{
								handleSpaceCorrection = 10 - height;
								height = 10;
							}

							if (customScrollHandle.offsetHeight != height)
							{
								customScrollHandle.style.height = height + "px";
							}

							onRealScroll();
							onCustomScroll();
						}
					}
				};
				adjustHeight();
				this.scrollHeightMonitorInterval = setInterval(adjustHeight, 100);
					
				function onCustomScroll()
				{
					if (scrollShown)
					{
						customScrollHandle.style.top = (customScrollArea.offsetHeight - barBtnHeight * 2 - handleSpaceCorrection) * customScrollArea.scrollTop / customScrollContent.offsetHeight + barBtnHeight + "px";
						if ($realScrollArea.scrollTop() != $customScrollArea.scrollTop())
						{
							$realScrollArea.scrollTop($customScrollArea.scrollTop());
						}
					}
				};
				onCustomScroll();
				$customScrollArea.scroll(onCustomScroll);

				function onRealScroll()
				{
					if (scrollShown)
					{
						if ($customScrollArea.scrollTop() != $realScrollArea.scrollTop())
						{
							$customScrollArea.scrollTop($realScrollArea.scrollTop());
						}
					}
				}

				$realScrollArea.scroll(onRealScroll);
				$navigationPane.scroll(function() { $navigationPane.scrollLeft(0); });
			};

			var getTranslation = function(translations: {[lang: string]: string;}, fallbackTranslations: {[lang: string]: string;})
			{
				if (translations || fallbackTranslations)
				{
					var culture = model.culture();
					if (culture)
					{
						if (translations && translations[culture])
						{
							return translations[culture];
						}
						if (fallbackTranslations && fallbackTranslations[culture])
						{
							return fallbackTranslations[culture];
						}

						if (culture.indexOf("-") != -1)
						{
							culture = culture.replace(/\-.*$/, "");
							if (translations && translations[culture])
							{
								return translations[culture];
							}
							if (fallbackTranslations && fallbackTranslations[culture])
							{
								return fallbackTranslations[culture];
							}
						}
					}
				}
			};

			model.getNavigationItemName = function(item: Navigation.INavigationItem): string
			{
				if (item == Navigation.homeNavigationItem)
				{
					return model.localize("apphost.home");
				}
				else
				{
					var name = getTranslation(item.translations, item.applicationEntryPoint && item.applicationEntryPoint.translations) ||
								(item.titleResource && model.localize(item.titleResource)) || item.title;
					if (name)
					{
						return name;
					}

					switch(item.type)
					{
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

			model.getNavigationGroupName = function(group: Navigation.INavigationGroup): string
			{
				return getTranslation(group.translations, group.applicationEntryPointGroup && group.applicationEntryPointGroup.translations) || group.title || group.id;
			};

			model.registerTargetDisplayFrame = function(targetDisplay: Navigation.ITargetDisplay, frame: HTMLIFrameElement): void
			{
				targetDisplay.targetDisplay.frame = frame;
			};

			Navigation.initialize(() =>
				{
					var currentItem = Navigation.currentNavigationItem();
					model.navigationPaneShown = ko.observable(currentItem
								? (currentItem.type == "home" && !currentItem.navigationGroup.authenticationTargetDisplay)
								: !Navigation.currentNavigationGroup());
					model.navigationGroups = Navigation.navigationGroups;
					model.currentNavigationItem = Navigation.currentNavigationItem;
					model.currentNavigationGroup = Navigation.currentNavigationGroup;
					model.navigationItemTargetDisplays = Navigation.navigationItemTargetDisplays;
					model.authenticationTargetDisplays = Navigation.authenticationTargetDisplays;
					model.topNavigationGroup = Navigation.topNavigationGroup;
					model.homeNavigationItem = Navigation.homeNavigationItem;

					model.navigationPaneToggleShown = ko.computed(function()
					{
						var currentGroup: Navigation.INavigationGroup;
						var currentItem = model.currentNavigationItem();
						if (currentItem)
						{
							currentGroup = currentItem.navigationGroup;
						}
						else
						{
							currentGroup = model.currentNavigationGroup();
						}

						if (currentGroup && currentGroup.authenticationTargetDisplay)
						{
							var authTargetDisplay = currentGroup.authenticationTargetDisplay();
							if (authTargetDisplay)	// current navigation group requires authentication
							{
								var applicationToAuthenticate = authTargetDisplay.targetDisplay.application;
								var visitedNavigationGroups = model.visitedNavigationGroups();
								for (var i = 0, len = visitedNavigationGroups.length; i < len; i++)
								{
									var group = visitedNavigationGroups[i];
									if (group != currentGroup && (!group.authenticationTargetDisplay || !group.authenticationTargetDisplay() ||
										SDL.jQuery.inArray(applicationToAuthenticate, group.applications) == -1))
									{
										// a group exists that is not blocked by current app's authentication screen
										return true;	// -> keep the button shown
									}
								}
								// there are no other navigation groups that have been accesssed -> hide the toggle button
								return false;
							}
						}
						return true;
					});

					model.expandedNavigationGroup = ko.observable((() =>
						{
							var groupsCount = 0;
							var singleGroupToExpand;
							for (var i = 0, len = model.navigationGroups.length; i < len; i++)
							{
								var group = model.navigationGroups[i];
								if (group.shownItems())
								{
									if (groupsCount)
									{
										return null;	// more than 1 groups have items -> expand none
									}
									singleGroupToExpand = group;
									groupsCount++;
								}
							}
							return singleGroupToExpand;
						})());

					model.onNavigationSelectionChanged = ko.computed(function(): void
					{
						var currentNavigationItem = Navigation.currentNavigationItem();
						var currentNavigationGroup = Navigation.currentNavigationGroup();
						if (currentNavigationItem)
						{
							currentNavigationGroup = currentNavigationItem.navigationGroup;
							model.navigationPaneShown(currentNavigationItem.type == "home" &&
								(!currentNavigationGroup.authenticationTargetDisplay || !currentNavigationGroup.authenticationTargetDisplay()));
							
							if (currentNavigationGroup != Navigation.topNavigationGroup)
							{
								model.expandedNavigationGroup(currentNavigationGroup);
							}
						}
						else if (currentNavigationGroup)
						{
							model.navigationPaneShown(false);
							model.expandedNavigationGroup(currentNavigationGroup);
						}
						else
						{
							model.navigationPaneShown(true);
						}

						if (currentNavigationGroup && model.visitedNavigationGroups.indexOf(currentNavigationGroup) == -1)
						{
							model.visitedNavigationGroups.push(currentNavigationGroup);
						}
					});

					model.onExpandedNavigationGroupChanged = model.expandedNavigationGroup.subscribe(function()
					{
						var navGroup = model.expandedNavigationGroup();
						if (navGroup)
						{
							var targetDisplay = navGroup.authenticationTargetDisplay && navGroup.authenticationTargetDisplay();
							if (targetDisplay && targetDisplay.authenticationMode == "on-access" && targetDisplay.navigationGroup() != navGroup)
							{
								targetDisplay.navigationGroup(navGroup);
								targetDisplay.accessed(true);
							}
						}
					});

					model.shownTargetDisplay = ko.computed((): Navigation.ITargetDisplay =>
					{
						var navigationItem = Navigation.currentNavigationItem();
						if (navigationItem)
						{
							return (navigationItem.navigationGroup &&
									navigationItem.navigationGroup.authenticationTargetDisplay &&
									navigationItem.navigationGroup.authenticationTargetDisplay()) ||
								(!navigationItem.hidden() && navigationItem.targetDisplay);
						}
						else
						{
							var navigationGroup = Navigation.currentNavigationGroup();
							if (navigationGroup)
							{
								return navigationGroup.authenticationTargetDisplay();
							}
						}
					});

					this.setInitialized();
				});

			return model;
		}

		private setInitialized(): void
		{
			this.updateTitleBar = ko.computed(() =>
			{
				var currentNavigationItem = Navigation.currentNavigationItem();
				if (!currentNavigationItem)
				{
					window.document.title = this.model.localize("apphost.apptitle");
				}
				else
				{
					window.document.title = this.model.localize("apphost.apptitle") + " - " + this.model.getNavigationItemName(currentNavigationItem);
				}
			});

			this.initialized(true);
		}
    }

	Frame.prototype.disposeInterface = SDL.Client.Types.OO.nonInheritable(function SDL$Client$Frame$Views$Frame$disposeInterface()
	{
		if (this.scrollHeightMonitorInterval)
		{
			window.clearInterval(this.scrollHeightMonitorInterval);
			this.scrollHeightMonitorInterval = null;
		}
		if (this.updateTitleBar)
		{
			(<KnockoutComputed>this.updateTitleBar).dispose();
			this.updateTitleBar = null;
		}

		if (this.model)
		{
			var model: IFrameViewModel = this.model;
			if (model.shownTargetDisplay)
			{
				model.shownTargetDisplay.dispose();
				model.shownTargetDisplay = null;
			}
			if (model.onNavigationSelectionChanged)
			{
				model.onNavigationSelectionChanged.dispose();
				model.onNavigationSelectionChanged = null;
			}
			if (model.onExpandedNavigationGroupChanged)
			{
				model.onExpandedNavigationGroupChanged.dispose();
				model.onExpandedNavigationGroupChanged = null;
			}
			if (model.navigationPaneToggleShown)
			{
				model.navigationPaneToggleShown.dispose();
				model.navigationPaneToggleShown = null;
			}

			model.dispose();
			this.model = null;
		}
	});

	SDL.Client.Types.OO.createInterface("SDL.Client.UI.ApplicationHost.Views.Frame", Frame);
}