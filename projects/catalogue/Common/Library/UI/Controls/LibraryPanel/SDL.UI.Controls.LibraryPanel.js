(function () {
    /**
     * Initializes a new instance of the Library Panel control
     * 
     * @param {object} element The DOM element on which to apply the control
     * @param {object} options Configuration options for the control
     * {
     *      
     * }
     */
    var LibraryPanel = function (element, options) {
        var self = this;
        options = options || {};
        this._isDisposed = false;

        /**
         * Used for managing the adding and disposing of event listeners
         */
        this.eventCoordinator = new EventCoordinator(this);

        this.element = element;
        this.previousData = [];
        this.previouslySelectedItems = [];
        this.onSelectionCallback = options.onSelectionCallback;
        this.rawData = [];
        this.rootName = options.rootName || '';
        this.element = element;
        this.onCloseCallback = options.onClose;
        this.isClosable = options.isClosable;
        this.useCommonUILibraryScrollView = options.useCommonUILibraryScrollView === false ? false : true;
        this.panelWidth = this.element.offsetWidth;

        element.classList.add('sdl-library-selector');
        this._createHeaderHTML(element, options.title);

        this.mainListContainer = this._createBodyHTML(element, options.subTitle || SDL.Globalize.culture().messages['LibraryPanel.SelectItem']);

        if (this.useCommonUILibraryScrollView) {
            this.commonUILibraryScrollView = new SDL.UI.Controls.ScrollView(this.mainListContainer, {});
        }

        var closeButton = this.mainContainer.parentElement.querySelector('header > button');
        if (this.isClosable) {
            this.eventCoordinator.register(closeButton, 'click', this._closeButtonHandler);
            this.closeButton = new SDL.UI.Controls.Button(closeButton, {  //ignore jslint
                iconClass: {
                    light: 'small close mono-bright',
                    dark: 'small close mono-dark'
                },
                purpose: 'general',
                style: 'icon'
            });
        }

        this.eventCoordinator.register(this.mainListContainer, 'click', this._listClickHandler);

        var backButton = this.mainContainer.querySelector('.back-button');
        this.eventCoordinator.register(backButton, 'click', this._backClickHandler);
        this.backButton = new SDL.UI.Controls.Button(backButton, {  //ignore jslint
            iconClass: {
                light: 'small back mono-bright',
                dark: 'small back mono-dark'
            },
            purpose: 'general'
        });

        var heirarchyButton = this.mainContainer.querySelector('.heirarchy-button');
        this.eventCoordinator.register(heirarchyButton, 'click', this._toggleHeirarchyMenu);
        this.heirarchyButton = new SDL.UI.Controls.Button(heirarchyButton, {  //ignore jslint
            iconClass: {
                light: 'heirarchy-button',
                dark: 'heirarchy-button'
            },
            purpose: 'general',
            style: 'icon'
        });

        var confirmationButton = this.mainContainer.querySelector('button.confirmation');
        this.eventCoordinator.register(confirmationButton, 'click', this._itemSelectConfirmation);
        this.confirmationButton = new SDL.UI.Controls.Button(confirmationButton, {  //ignore jslint
            purpose: 'confirm',
            disabled: true
        });

        this.eventCoordinator.register(element, 'keydown', this._keyHandler);

        this.eventCoordinator.register(element, 'click', this._closeOpenedMenu);

        this.eventCoordinator.register(this.heirarchyList, 'click', this._heirarchyListClickHandler);

        //run the update to kick off list rendering
        this.update(options);
    };

    /**
     * This render method is required by Lucia/Catalina, see http://jira.global.sdl.corp:8090/confluence/display/DEV/Views+and+controls
     */
    LibraryPanel.prototype.render = function (callback) {
        if (typeof callback === 'function') {
            callback();
        }
    };

    /**
     * Updates the options for the control 
     * 
     * @param {object} options Configuration options for the control
     */
    LibraryPanel.prototype.update = function (options) {
        this.selectedItemId = options.data.selectedItemId;
        this.rootName = options.rootName;

        this._findSelectedItemLevelData(options.data);

        if (this.currentData) {
            this._renderList(this.currentData, this.mainListContainer);
        }
    };

    var EventCoordinator = function (context) {
        this.context = context;
        this.registeredEventListeners = [];
    }

    EventCoordinator.prototype.register = function (element, type, listener, useCapture) {
        var listenerDefinition = {
            element: element,
            type: type,
            listener: listener.bind(this.context),
            useCapture: useCapture
        };
        this.registeredEventListeners.push(listenerDefinition);
        listenerDefinition.element.addEventListener(listenerDefinition.type, listenerDefinition.listener, listenerDefinition.useCapture);
    };

    EventCoordinator.prototype.dispose = function () {
        var listenerDefinition;
        while (this.registeredEventListeners.length > 0) {
            listenerDefinition = this.registeredEventListeners.pop();
            listenerDefinition.element.removeEventListener(listenerDefinition.type, listenerDefinition.listener, listenerDefinition.useCapture);
        }
    };

    /**
     * Disposes of the control
     */
    LibraryPanel.prototype.dispose = function () {
        //clear up all event handlers
        this.eventCoordinator.dispose();

        //call dispose on buttons
        if (this.closeButton) {
            this.closeButton.dispose();
        }
        this.backButton.dispose();
        this.heirarchyButton.dispose();
        this.confirmationButton.dispose();

        if (this.useCommonUILibraryScrollView) {
            this.commonUILibraryScrollView.dispose();
        }

        this.element.classList.remove('sdl-library-selector');

        this._isDisposed = true;
    };

    /**
     * Returns true if this control has been diposed, otherwise false
     */
    LibraryPanel.prototype.getDisposed = function () {
        return this._isDisposed;
    };

    /**
     * Parses the data passed in to the component and detrmines the currently selected item and it's sibling list items, parent items and builds the heirarchy state from it.
     * 
     * @param {object} options The full options object passed in to the library component
     */
    LibraryPanel.prototype._findSelectedItemLevelData = function (data) {

        //clear down the previous data to rebuild from what was passed in
        this.previousData.length = 0;
        this.heirarchyList.querySelector('ul').innerHTML = '';

        this._getLevelItems(data, this.rootName);

        if (this.previousData.length === 0) {
            this.backButton.disable();
            this.heirarchyButton.disable();
            this.mainContainer.querySelector('.current-level').innerHTML = this.rootName;
        }
    };

    LibraryPanel.prototype._getLevelItems = function (data, levelName) {
        var items = [], isCurrentData = false, levelHasNoChildren = true;

        this.mainContainer.querySelector('.current-level').innerHTML = levelName;

        for (var i = 0; i < data.length; i++) {
            items.push(data[i]);
            if (data[i].children && data[i].children.length > 0) {
                this._addToHeirarchy({
                    name: levelName
                });
                
                this.mainContainer.querySelector('.button-ribbon > i').setAttribute('data-type', data[i].dataType || '');
                this.backButton.enable();
                levelHasNoChildren = false;

                this.previousData.push(items);

                this._getLevelItems(data[i].children, data[i].name);
            }

            if (data[i].isSelected) {
                isCurrentData = true;
            }
        }

        if (isCurrentData || levelHasNoChildren) {
            this.currentData = items;
        }
    };

    /**
     * Creates the HTML elements for the header portion of the library component
     * 
     * @param {object} element The containing element in which to insert the HTML
     * @param {string} title The title to be rendered in the header
     */
    LibraryPanel.prototype._createHeaderHTML = function (element, title) {
        var header = document.createElement('header');
        var headerHtml = '<span>' + title + '</span>';
        if (this.isClosable) {
            headerHtml += '<button></button>';
        }
        header.innerHTML = headerHtml;

        element.appendChild(header);
    };

    /**
     * Creates the HTML elements for the body of the library component
     * 
     * @param {object} element The containing element in which to insert the HTML
     * @param {string} subTitle A sub-title string which will be rendered under the main header element
     */
    LibraryPanel.prototype._createBodyHTML = function (element, subTitle) {
        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('main-container');
        this.mainContainer.innerHTML = '<div class="select-row">' +
                '<span class="sub-heading">' + subTitle + '</span>' +
                '<button class="confirmation">' + SDL.Globalize.culture().messages['LibraryPanel.Select'] + '</button>' +
            '</div>' +
            '<div class="button-ribbon">' +
                '<button class="text-button back-button">' +
                    '<span>' + SDL.Globalize.culture().messages['LibraryPanel.Back'] + '</span>' +
                '</button>' +
                '<button class="icon-button heirarchy-button">' +
                '</button>' +
                '<i class="large"></i>' +
                '<span class="current-level"></span>' +
                '<div class="bottom-border"></div>' +
            '</div>';

        var mainList = document.createElement('div');
        mainList.setAttribute("tabIndex", 0);
        mainList.innerHTML = '<ul></ul>';
        mainList.classList.add('main-list');

        this.mainContainer.appendChild(mainList);

        //create a second list container in order to facilitate the "sliding" effect
        this.previousListContainer = document.createElement('div');
        this.previousListContainer.innerHTML = '<ul></ul>';
        this.previousListContainer.classList.add('previous-list');
        this.previousListContainer.style.left = -this.panelWidth + 'px';

        this.mainContainer.appendChild(this.previousListContainer);

        //create the heirarchy menu html
        this.heirarchyList = document.createElement('div');
        this.heirarchyList.style.display = 'none';
        this.heirarchyList.classList.add('heirarchy-list');
        this.heirarchyList.innerHTML = '<div class="arrow-up"></div><ul></ul>';

        this.mainContainer.appendChild(this.heirarchyList);

        //append the main body container to the root element
        element.appendChild(this.mainContainer);

        return mainList;
    };

    /**
     * Renders a list of items with the given data inside the passed in container
     * 
     * @param {array} data The data to render as dom li elements
     * @param {object} listContainer The containing element to render the list inside
     */
    LibraryPanel.prototype._renderList = function (data, listContainer) {
        var listElement = listContainer.querySelector('ul');
        var htmlString = '';
        for (var i = 0; i < data.length; i++) {
            htmlString += '<li data-id="' + data[i].id + '" class="';

            if (data[i].id === this.selectedItemId || (this.selectedItem && data[i].id === this.selectedItem.id)) {
                htmlString += 'selected';
            }

            if (data[i].isDrillable & data[i].isSelectable) {
                htmlString += ' is-drillable';
            }

            htmlString += '"><div><i class="large" data-type="' + data[i].dataType + '"></i><span>' + data[i].name + '</span>';

            if (data[i].isSelectable) {
                htmlString += '<i class="radio-button"></i>';
            }

            htmlString += '</div>';

            if (!data[i].isSelectable) {
                htmlString += '<i class="arrow-right small mono-dark"></i>';
            } else if (data[i].isDrillable) {
                htmlString += '<i class="arrow-right small mono-dark drill-button"></i>';
            }
            htmlString += '</li>';
        }

        listElement.innerHTML = htmlString;
    };

    /**
     * Click handler for the current list of items
     * 
     * @param {object} event The click event
     */
    LibraryPanel.prototype._listClickHandler = function (event) {
        var clickedElement = event.target;
        var selectedId;

        var isDrillDown = clickedElement.classList.contains('drill-button');

        if (clickedElement.getAttribute('data-id')) {
            selectedId = clickedElement.getAttribute('data-id');
        } else {
            //traverse up the dom, looking for the li element. Stop when reaching the ul the handler is attached to
            while (!clickedElement.getAttribute('data-id') && clickedElement !== event.currentTarget) {
                clickedElement = clickedElement.parentElement;
            }
            if (clickedElement.getAttribute('data-id')) {
                selectedId = clickedElement.getAttribute('data-id');
            }
        }

        if (selectedId) {
            this._selectItemById(clickedElement, parseInt(selectedId, 10), isDrillDown);
        }

    };

    /**
     * Selects an item at the current level by id
     * 
     * @param {string} itemId The id of the item to select
     * @param {isDrillAction} isDrillAction True if the selection is a drill down, false if it is a plain item selection.
     */
    LibraryPanel.prototype.selectItemById = function (itemId, isDrillAction) {
        var listElement = this.mainListContainer.querySelector('[data-id="' + itemId + '"]');

        if (listElement) {
            this._selectItemById(listElement, itemId, isDrillAction);
        }
    };

    /**
     * Selects an item in the current list by it's id property
     * 
     * @param {object} listElement The dom li element which was selected
     * @param {number} selectedId The id of the selected item
     * @param {boolean} isDrillAction Boolean to indicate whether the selection was a drill down or standard selection
     */
    LibraryPanel.prototype._selectItemById = function (listElement, selectedId, isDrillAction) {
        //find the data item by id
        var selectedItem = null;
        for (var i = 0; i < this.currentData.length; i++) {
            if (this.currentData[i].id === selectedId) {
                selectedItem = this.currentData[i];
                break;
            }
        }

        if (selectedItem && selectedItem.isSelectable && !isDrillAction) {
            //if item is selectable, select it and enable select button
            this.selectedItem = selectedItem;
            var previouslySelectedElement = listElement.parentElement.querySelector('.selected');
            if (previouslySelectedElement) {
                previouslySelectedElement.classList.remove('selected');
            }
            listElement.classList.add('selected');

            this.confirmationButton.enable();
        } else {

            listElement.classList.add('selected');

            //otherwise get the next level of data
            this._getNextLevel(selectedItem);
        }
    };

    /**
     * Gets the next level of data given the passed in item
     * 
     * @param {object} selectedItem The selected item for which the next level of data should be retrieved
     */
    LibraryPanel.prototype._getNextLevel = function (selectedItem) {
        var self = this;

        if (selectedItem.getDataFor) {
            //use the previous list container to slide in the next list of items
            self.previousListContainer.style.left = this.panelWidth + 'px';

            //ensure there is time for the ui to update with the class applied in the previous line
            setTimeout(function () {
                selectedItem.getDataFor(selectedItem.id, function (data) {
                    self.confirmationButton.disable();
                    self._renderList(data, self.previousListContainer);

                    self.mainListContainer.classList.add('transit');
                    self.mainListContainer.style.left = -self.panelWidth + 'px';
                    self.previousListContainer.classList.add('transit');
                    self.previousListContainer.style.left = 0;

                    var transitionEnd = function () {
                        self._renderList(data, self.mainListContainer);
                        self.mainListContainer.classList.remove('transit');
                        self.mainListContainer.style.left = 0;
                        self.previousListContainer.classList.remove('transit');
                        self.previousListContainer.style.left = -self.panelWidth + 'px';

                        var nameSpan = self.mainContainer.querySelector('.current-level');
                        nameSpan.innerHTML = selectedItem.name;
                        nameSpan.previousSibling.setAttribute("data-type", selectedItem.dataType);
                        self.currentData = data;
                        self.mainListContainer.removeEventListener('transitionend', transitionEnd);
                        self.backButton.enable();
                        self.heirarchyButton.enable();
                    };

                    self.mainListContainer.addEventListener('transitionend', transitionEnd);
                    self.previousData.push(self.currentData);
                    if (self.previouslySelectedItems.length > 0) {
                        self._addToHeirarchy(self.previouslySelectedItems[self.previouslySelectedItems.length - 1]);
                    } else {
                        self._addToHeirarchy({
                            name: self.rootName
                        });
                    }

                    self.previouslySelectedItems.push(selectedItem);
                });
            }, 1);
        }
    };

    /**
     * Adds the passed in item to the heirarchy menu
     * 
     * @param {object} item The item object which is to be added to the heirarchy
     */
    LibraryPanel.prototype._addToHeirarchy = function (item) {
        var newListElement = document.createElement('li');
        newListElement.innerHTML = '<i class="small" data-type="' + item.dataType + '"></i><span>' + item.name + '</span>';

        this.heirarchyList.querySelector('ul').appendChild(newListElement);
    };

    /**
     * Click handler for the back button for heirarchy navigation
     */
    LibraryPanel.prototype._backClickHandler = function () {
        var self = this;
        if (this.previousData.length > 0) {
            this.currentData = this.previousData.pop();
            this._renderList(this.currentData, this.previousListContainer);
            this.previousListContainer.classList.add('transit-back');
            this.previousListContainer.style.left = 0;
            this.mainListContainer.classList.add('transit-back');
            this.mainListContainer.style.left = this.panelWidth + 'px';

            this.confirmationButton.disable();
            var heirarchyListElement = this.heirarchyList.querySelector('ul');

            var transitionEnd = function () {
                self._renderList(self.currentData, self.mainListContainer);
                self.mainListContainer.classList.remove('transit-back');
                self.mainListContainer.style.left = 0;
                self.previousListContainer.classList.remove('transit-back');
                self.previousListContainer.style.left = -self.panelWidth + 'px';

                if (heirarchyListElement.children.length > 0) {
                    self.previouslySelectedItems.pop();
                    self.mainContainer.querySelector('.current-level').innerHTML = heirarchyListElement.lastChild.querySelector('span').innerHTML;
                    self.mainContainer.querySelector('.button-ribbon > i').setAttribute('data-type', heirarchyListElement.lastChild.querySelector('i').getAttribute('data-type'));
                    heirarchyListElement.removeChild(heirarchyListElement.lastChild);
                } else {
                    self.mainContainer.querySelector('.current-level').innerHTML = self.rootName;
                    self.mainContainer.querySelector('.button-ribbon > i').setAttribute('data-type', '');
                }

                if (heirarchyListElement.children.length === 0) {
                    self.backButton.disable();
                    self.heirarchyButton.disable();
                }

                self.mainListContainer.removeEventListener('transitionend', transitionEnd);
            };

            this.mainListContainer.addEventListener('transitionend', transitionEnd);
        }
    };

    /**
     * Toggles the heirarchy menu open or closed (visible or not)
     */
    LibraryPanel.prototype._toggleHeirarchyMenu = function () {
        if (this.heirarchyList.offsetParent === null && this.heirarchyList.querySelector('ul').children.length > 0) {
            this.heirarchyList.style.display = 'block';
        } else {
            //de-select any keyboard selection
            var selectedItem = this.heirarchyList.querySelector('li.focused');
            if (selectedItem) {
                selectedItem.classList.remove('focused');
            }
            this.heirarchyList.style.display = 'none';
        }

    };

    /**
     * Click handler for the heirarchy list
     * 
     * @param {object} event The click event. 
     */
    LibraryPanel.prototype._heirarchyListClickHandler = function (event) {
        var clickedElement = event.target;

        while (clickedElement.tagName !== 'LI') {
            clickedElement = clickedElement.parentElement;
        }

        //get the index of the clicked item in the list
        var clickedLevel = Array.prototype.indexOf.call(clickedElement.parentElement.childNodes, clickedElement);
        var heirarchyListElement = this.heirarchyList.querySelector('ul');

        //remove all items after the clicked level
        for (var i = this.previousData.length; i > clickedLevel; i--) {
            this.currentData = this.previousData.pop();
            if (heirarchyListElement.children.length > 0) {
                heirarchyListElement.removeChild(heirarchyListElement.lastChild);
                this.previouslySelectedItems.pop();
            }
        }

        //clear any existing selection
        this.confirmationButton.disable();

        //re-render the lists with the clicked level data
        this._renderList(this.currentData, this.previousListContainer);

        var self = this;
        var transitionEnd = function () {
            self._renderList(self.currentData, self.mainListContainer);
            self.mainListContainer.classList.remove('transit-back');
            self.mainListContainer.style.left = 0;
            self.previousListContainer.classList.remove('transit-back');
            self.previousListContainer.style.left = -self.panelWidth + 'px';
            var currentLevelElement = heirarchyListElement.lastChild;
            if (currentLevelElement) {
                self.mainContainer.querySelector('.current-level').innerHTML = currentLevelElement.querySelector('span').innerHTML;
                self.mainContainer.querySelector('.button-ribbon > i').setAttribute('data-type', currentLevelElement.querySelector('i').getAttribute('data-type'));
            } else {
                self.mainContainer.querySelector('.current-level').innerHTML = self.rootName;
                self.mainContainer.querySelector('.button-ribbon > i').setAttribute('data-type', '');
            }

            self.mainListContainer.removeEventListener('transitionend', transitionEnd);

            if (heirarchyListElement.children.length === 0) {
                self.backButton.disable();
                self.heirarchyButton.disable();
            }
        };

        this.previousListContainer.classList.add('transit-back');
        this.previousListContainer.style.left = 0;
        this.mainListContainer.classList.add('transit-back');
        this.mainListContainer.style.left = this.panelWidth + 'px';

        this.mainListContainer.addEventListener('transitionend', transitionEnd);

    };

    /**
     * Click handler for the select button
     */
    LibraryPanel.prototype._itemSelectConfirmation = function () {
        this.onSelectionCallback(this.selectedItem);
    };

    /**
     * Click handler for the library close button
     */
    LibraryPanel.prototype._closeButtonHandler = function () {
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    };

    /**
     * Closes the heirarchy menu
     * 
     * @param {object} event The click event which triggered the close
     */
    LibraryPanel.prototype._closeOpenedMenu = function (event) {
        var targetEl = event.target;

        var heirarchyButton = this.mainContainer.querySelector('.heirarchy-button');
        if (!heirarchyButton.contains(targetEl) && targetEl !== heirarchyButton) {
            this.heirarchyList.style.display = 'none';
        }
    };

    /**
     * Key press handler for all library keyboard functions
     *
     * @param {object} event The key press event
     */
    LibraryPanel.prototype._keyHandler = function (event) {
        var focusedHeirarchyItem, itemId;
        var keyCode = event.keyCode;
        var focusedListItem = this.mainListContainer.querySelector('.focused');
        var mainListElement = this.mainListContainer.querySelector('ul');
        switch (keyCode) {
            case 36:    //home key
                //just simulate a click on the top heirarchy list element
                var mockEvent = { target: this.heirarchyList.querySelector('ul').firstChild };
                this._heirarchyListClickHandler(mockEvent);
                break;
            case 37: //left arrow
                this._backClickHandler();
                break;
            case 38: //up arrow
                if (this.heirarchyList.offsetParent) { //if the heirarchy list is open, arrows control list selection
                    focusedHeirarchyItem = this.heirarchyList.querySelector('li.focused');
                    if (focusedHeirarchyItem && focusedHeirarchyItem.previousSibling) {
                        focusedHeirarchyItem.previousSibling.classList.add('focused');
                        focusedHeirarchyItem.classList.remove('focused');
                    } else {
                        this.heirarchyList.querySelector('ul').lastChild.classList.add('focused');
                        if (focusedHeirarchyItem) {
                            focusedHeirarchyItem.classList.remove('focused');
                        }
                    }
                } else if (document.activeElement === this.mainListContainer) {
                    if (focusedListItem) {
                        var previousItem = focusedListItem.previousSibling || mainListElement.lastChild;
                        previousItem.classList.add('focused');
                        focusedListItem.classList.remove('focused');
                        this._scrollIntoView(previousItem);
                    } else {
                        mainListElement.lastChild.classList.add('focused');
                    }
                    event.preventDefault(); //stop the scrollable area from scrolling from an up arrow press
                }
                break;
            case 40: //down arrow
                if (this.heirarchyList.offsetParent) { //if the heirarchy list is open, arrows control list selection
                    focusedHeirarchyItem = this.heirarchyList.querySelector('li.focused');
                    if (focusedHeirarchyItem && focusedHeirarchyItem.nextSibling) {
                        focusedHeirarchyItem.nextSibling.classList.add('focused');
                        focusedHeirarchyItem.classList.remove('focused');
                    } else {
                        this.heirarchyList.querySelector('ul').firstChild.classList.add('focused');
                        if (focusedHeirarchyItem) {
                            focusedHeirarchyItem.classList.remove('focused');
                        }
                    }
                } else if (document.activeElement === this.mainListContainer) {
                    if (focusedListItem) {
                        var nextItem = focusedListItem.nextSibling || mainListElement.firstChild;
                        nextItem.classList.add('focused');
                        focusedListItem.classList.remove('focused');
                        this._scrollIntoView(nextItem);
                    } else {
                        mainListElement.firstChild.classList.add('focused');
                    }
                    event.preventDefault(); //stop the scrollable area from scrolling from a down arrow press
                }
                break;
            case 13: //enter
                if (this.heirarchyList.offsetParent) { //if heirarchy list is open, enter makes a heirarchy selection, otherwise it selects a main list item
                    focusedHeirarchyItem = this.heirarchyList.querySelector('li.focused');
                    //use the click handler to make a selection with the focused item
                    this._heirarchyListClickHandler({ target: focusedHeirarchyItem });
                    this._toggleHeirarchyMenu();
                    event.preventDefault();
                } else if (focusedListItem) {
                    itemId = parseInt(focusedListItem.getAttribute('data-id'), 10);
                    this._selectItemById(focusedListItem, itemId, false);  //is a selection
                    //after selection set focus to the select button
                    this.mainContainer.querySelector('.select-row > button').focus();
                }
                break;
            case 39: //right arrow
                if (focusedListItem) {
                    itemId = parseInt(focusedListItem.getAttribute('data-id'), 10);
                    this._selectItemById(focusedListItem, itemId, true);  //is a drill down
                    //after selection set focus to the select button
                    this.mainContainer.querySelector('.select-row > button').focus();
                }
                break;

            case 27:    //escape
                //close the library selector
                this._closeButtonHandler();
                break;
        }
    };

    /**
     * Scrolls the passed in list node into the viewable area
     *
     * @param {object} listItem The list element to scroll into view
     */
    LibraryPanel.prototype._scrollIntoView = function (listItem) {
        var nodeBounds = listItem.getBoundingClientRect();
        var scrollableElem, bottomOffset;
        if (this.useCommonUILibraryScrollView) {
            scrollableElem = this.mainListContainer.firstChild;
            bottomOffset = parseInt(scrollableElem.style.bottom);
        } else {
            scrollableElem = this.mainListContainer;
            bottomOffset = 0;
        }

        var listBounds = scrollableElem.getBoundingClientRect();

        if (nodeBounds.top < listBounds.top) {
            scrollableElem.scrollTop += nodeBounds.top - listBounds.top;
        } else if (nodeBounds.bottom > listBounds.bottom + bottomOffset) {
            scrollableElem.scrollTop += nodeBounds.bottom - listBounds.bottom + 1 - bottomOffset;
        }
    };

    /**
     * Returns true if we are on a touch device, otherwise returns false
     */
    LibraryPanel.prototype._isTouchDevice = function () {
        return 'ontouchstart' in window || navigator.msMaxTouchPoints;
    };

    // Lucia/Catalina namespace
    SDL = SDL || {};
    SDL.UI = SDL.UI || {};
    SDL.UI.Controls = SDL.UI.Controls || {};
    SDL.UI.Controls.LibraryPanel = LibraryPanel;
}());