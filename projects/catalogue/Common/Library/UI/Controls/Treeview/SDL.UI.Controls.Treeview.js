var SDL = SDL || {};
SDL.UI = SDL.UI || {};
SDL.UI.Controls = SDL.UI.Controls || {};

/**
 * Implementation of a treeview control
 * Author: Tony Leeper © SDL 2014
 * 
 * Supports:
 *  lazy loading of nodes
 *  lazy rendering of nodes
 *  single-selection or multi-selection
 *  custom node content renderers
 *  custom node data-types for e.g. rendering different icons
 * 
 * Some terminology used in Trees:
 *  Root - the top most node in a tree.
 *  Parent - the converse notion of child.
 *  Siblings - nodes with the same parent.
 *  Descendant - a node reachable by repeated proceeding from parent to child.
 *  Ancestor - a node reachable by repeated proceeding from child to parent.
 *  Leaf - a node with no children.
 *  Depth - The level or depth of a node is defined by 1 + the number of connections between the node and the root.
 */
SDL.UI.Controls.TreeView = (function () {

    //#region data types

    /**
     * Represents a node in the tree
     * 
     * @param {string} id A Unique identifier for this node
     * @param {string} name A localised string to display for the node
     * @param {string} dataType Used to populate the 'data-type' attribute on an html node element so different styles can be applied
     * @param {array} parent The parent of this node
     * @param {array} children A preloaded collection of children of type Node
     * @param {boolean} isLeafNode True if this is a leaf node (contains no child nodes) 
     * @param {function(node, callback)} load A function that returns in the callback all the child nodes for the node, returns {array} of Node
     * @param {boolean} isSelectable True if this node is selectable, otherwise false (defaults to true)
     */
    var Node = function (id, name, dataType, parent, children, isLeafNode, load, isSelectable) {
        /**
         * unique identifier for this node
         * @type {string}
         */
        this.id = id;

        /**
         * the name of this node, used by the default node content renderer
         * @type {string}
         */
        this.name = name;

        /**
         * the data-type of this node, rendered as a custom data-type attribute on the li element used for styling custom node type icons 
         * with the following selector, e.g. 
         * .sdl-treeview li[data-type=USER] > div > i.node { 
         *    background: url(src/themes/carbon2/controls/TreeView/images/sprite.user-selection.color.min.svg) no-repeat center center;
         *    background-position: -101px -1px;
         * }
         * @type {string}
         */
        this.dataType = dataType;

        /**
         * the parent of this node, null for a rootNode
         * @type {Node}
         */
        this.parent = parent;

        /**
         * true if this node is a leaf node, otherwise false
         * @type {boolean}
         */
        this.isLeafNode = isLeafNode || false;

        /**
         * a collection of child nodes associated with this node
         * @type {array<Node>}
         */
        this.children = children;

        /**
         * loads the children of this node
         * @type {function(callback)}
         */
        this.load = load;

        /**
         * true if this node is currently loading its children, otherwise false
         * @type {boolean}
         */
        this.isLoading = false;

        /**
         * true if this node is rendering, otherwise false
         * @type {boolean}
         */
        this.isRenderering = false;

        /**
         * true if this node is expanded, otherwise false
         * @type {boolean}
         */
        this.isExpanded = false;

        /**
         * true if this node is selectable, otherwise false (defaults to true)
         * @type {boolean}
         */
        this.isSelectable = utils.getBooleanValueOrDefault(isSelectable, true);

        /**
         * true if this node is selected, otherwise false
         * @type {boolean}
         */
        this.isSelected = false;

        /**
         * true if this node is partially selected, otherwise false
         * @type {boolean}
         */
        this.isPartiallySelected = false;

        /**
         * the depth of this node in the tree structure, rootNode has a depth of 0
         * @type {number}
         */
        this.depth = this.parent ? this.parent.depth + 1 : 0;
    };

    /**
     * Returns the path to this node
     */
    Node.prototype.getPath = function () {
        var path = this.id;
        var node = this.parent;
        while (node) {
            path = node.id + '/' + path;
            node = node.parent;
        }

        return path;
    };

    /**
     * True if this node has rendered, otherwise false
     */
    Node.prototype.hasRendered = function () {
        return typeof this.element !== 'undefined';
    };

    /**
     * True if this node has loaded, otherwise false
     */
    Node.prototype.hasLoaded = function () {
        return this.isLeafNode || Array.isArray(this.children);
    };

    //#endregion

    //#region utils

    var utils = {
        /**
         * Delays execution of a function, cancelling execution if another function call is invoked within the delay period
         * 
         * @param fn The function to debounce
         * @param delay The delay in milliseconds
         */
        debounce: function (fn, delay) {
            var timeout;
            return function () {
                var self = this;
                var args = arguments;

                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function () {
                    fn.apply(self, args);
                    timeout = null;
                }, delay || 100);
            };
        },

        /**
         * Scrolls the element into view
         * 
         * @param {HTMLElement} scrollableElement the scrollable element
         * @param {HTMLElement} element the element to scroll into view
         * @param {number} bottomOffset an offset for the bottom overflow calculation (required to work around an issue with the common ui library scrollview)
         */
        scrollIntoView: function (scrollableElement, element, bottomOffset) {
            bottomOffset = bottomOffset || 0;

            // get the client bounds of the scrollable element and the node
            var scrollableBounds = scrollableElement.getBoundingClientRect();
            var elementBounds = element.getBoundingClientRect();

            if (elementBounds.height < scrollableBounds.height) { // element is smaller than the viewable scrollable area
                if (elementBounds.top < scrollableBounds.top) {
                    scrollableElement.scrollTop += elementBounds.top - scrollableBounds.top;
                } else if (elementBounds.bottom > scrollableBounds.bottom + bottomOffset) {
                    scrollableElement.scrollTop += elementBounds.bottom - scrollableBounds.bottom + 1 - bottomOffset;
                }
            } else { // element is larger than the viewable scrollable area
                scrollableElement.scrollTop += elementBounds.top - scrollableBounds.top;
            }
        },

        /**
         * if obj is an array, returns the array otherwise returs a new array of length 1 with obj as the first item
         * 
         * @param {object} the object to convert to an array
         */
        convertToArray: function (obj) {
            if (Array.isArray(obj)) {
                return obj;
            } else {
                return [obj];
            }
        },

        /**
         * Gets the truthy/falsy of 'value' if it is of type 'boolean', otherwise returns defaultValue
         * 
         * @param {boolean} value the boolean value to try
         * @param {boolean} defaultValue the default value to return if value is not a 'boolean' type, e.g. null or undefined
         */
        getBooleanValueOrDefault: function (value, defaultValue) {
            if (typeof value === 'boolean') {
                return value;
            } else {
                return defaultValue;
            }
        }
    };

    //#endregion

    //#region EventCoordinator

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

    //#endregion

    /**
     * Initializes a new instance of the treeview control
     * 
     * @param {HTMLElement} element the html dom container element to render the treeview inside of
     * @param {object} options configuration options for this control
     */
    var TreeView = function (element, options) {
        /**
         * True if this control has been disposed, otherwise false
         */
        this._isDisposed = false;

        /**
         * The DOM element that the treeview will render into
         */
        this.element = element;

        /**
         * Used for managing the adding and disposing of event listeners
         */
        this.eventCoordinator = new EventCoordinator(this);

        /**
         * A collection of callbacks to execute on disposal of this control
         */
        this.disposeCallbacks = [];

        /**
         * Keeps track of how many nodes are busy, used by queueSelectionChanged()
         * @type {number}
         */
        this.busyCount = 0;

        /**
         * The selected nodes array returned in the onSelectionChanged event
         * @type {array}
         */
        this.selectedNodes = [];

        /**
         * The selected nodes paths array used in getSelectedNodePaths()
         * @type {array}
         */
        this.selectedNodePaths = [];

        // add the 'sdl-treeview' class if we need to
        this.ensureClass(element);

        // make sure that this element is tabbable
        this.ensureTabbable(element);

        // init the treeview options
        this.initializeOptions(options);

        // render
        this.renderTree(element);

        // hook up event listeners
        this.eventCoordinator.register(this.element, 'click', this.clickEventHandler);
        this.eventCoordinator.register(this.element, 'keydown', this.keyDownHandler);

        // set the active node to the activeNodeIdPath if defined, otherwise set the active node to the first root node
        if (options.activeNodeIdPath) {
            this.setActiveNodeByPath(options.activeNodeIdPath);
        } else {
            this.setActiveNode(this.rootNodes[0]);
        }
    };

    /**
     * Initializes the treeview options
     * 
     * @param {object} options configuration options for this control
     */
    TreeView.prototype.initializeOptions = function (options) {
        /**
         * Callback to fire on selection changed
         * @type {function(selectedItems)}
         */
        this.onSelectionChanged = utils.debounce(options.onSelectionChanged);

        /**
         * A collection of root nodes
         * @type {array}
         */
        this.rootNodes = utils.convertToArray(options.rootNodes);

        /**
         * An optional custom node content renderer to use when rendering node contents rather than just displaying the node name
         * @type {function}
         */
        this.nodeContentRenderer = options.nodeContentRenderer;

        /**
         * True if multi-selection is enabled, otherwise false
         * @type {boolean}
         */
        this.multiselectEnabled = utils.getBooleanValueOrDefault(options.multiselect, false);

        /**
         * True if the control should include fully selected branch nodes in a selection, otherwise false
         * @type {boolean}
         */
        this.includeBranchNodesInSelection = utils.getBooleanValueOrDefault(options.includeBranchNodesInSelection, false);

        /**
         * True if the control should render a data-id attribute on each LI node containing the node id, otherwise false
         * @type {boolean}
         */
        this.renderDataIdAttribute = utils.getBooleanValueOrDefault(options.renderDataIdAttribute, false);

        /**
         * True if the control should use the common ui library ScrollView to display scrollbars, otherwise false
         * @type {boolean}
         */
        this.useCommonUILibraryScrollView = utils.getBooleanValueOrDefault(options.useCommonUILibraryScrollView, true);
    };

    /**
     * Queues a selection changed event, raises only when no nodes are busy
     */
    TreeView.prototype.queueSelectionChanged = function () {
        var self = this;
        if (self.busyCount === 0) {
            if (self.multiselectEnabled) {
                self.selectedNodes.length = 0;
                self.setSelectedNodes(self.rootNodes);
            }
            self.onSelectionChanged(self.selectedNodes);
        } else {
            if (self.selectionChangedTimeout === null || typeof self.selectionChangedTimeout === 'undefined') {
                self.selectionChangedTimeout = setTimeout(function () {
                    self.selectionChangedTimeout = null;
                    self.queueSelectionChanged();
                }, 25);
            }
        }
    };

    /**
     * Sets the selected nodes that will be returned in an onSelectionChanged event
     * 
     * @param {array} nodes the list of nodes to check for selected state (also checks descendants of these nodes)
     */
    TreeView.prototype.setSelectedNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].isSelected) {
                if (nodes[i].isLeafNode || this.includeBranchNodesInSelection) {
                    this.selectedNodes.push(nodes[i]);
                }
            }

            if (!nodes[i].isLeafNode && nodes[i].isSelected || nodes[i].isPartiallySelected) {
                this.setSelectedNodes(nodes[i].children);
            }
        }
    };

    /**
     * Gets a collection of currently selected node paths that can be used in future to restore the selection state of the tree with a call to selectNodesByPath(paths)
     */
    TreeView.prototype.getSelectedNodePaths = function () {
        this.selectedNodePaths.length = 0;
        this.setSelectedNodePaths(this.rootNodes);
        return this.selectedNodePaths;
    };

    /**
     * Gets the treeview selection state, returns a stringified array of selected node paths
     */
    TreeView.prototype.getTreeViewSelectionState = function () {
        return JSON.stringify(this.getSelectedNodePaths());
    };

    /**
     * Restores the treeview selection state from an array of selected node paths
     * 
     * @param {string} selectionState the selection state string returned from a call to getTreeViewSelectionState()
     */
    TreeView.prototype.restoreTreeViewSelectionState = function (selectionState) {
        if (selectionState) {
            this.selectNodesByPath(JSON.parse(selectionState));
        }
    };

    /**
     * Sets the selected node paths 
     * 
     * @param {array} nodes the list of nodes to check for selected state (also checks descendants of these nodes)
     */
    TreeView.prototype.setSelectedNodePaths = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].isSelected) {
                if (nodes[i].isLeafNode || this.includeBranchNodesInSelection) {
                    this.selectedNodePaths.push(nodes[i].getPath());
                }
            }

            if (!nodes[i].isLeafNode && nodes[i].isSelected || nodes[i].isPartiallySelected) {
                this.setSelectedNodePaths(nodes[i].children);
            }
        }
    };

    /**
     * Updates the control with new configuration options
     * 
     * @param {object} options configuration options for this control
     */
    TreeView.prototype.update = function (options) {
        if (options.activeNodeIdPath && options.activeNodeIdPath !== this.activeNodeIdPath) {
            this.setActiveNodeByPath(options.activeNodeIdPath);
        }


    };

    /**
     * Disposes of this control, releasing any added event handlers
     */
    TreeView.prototype.dispose = function () {
        this.eventCoordinator.dispose();
        this.disposeCallbacks.forEach(function (callback) {
            callback();
        });
        this._isDisposed = true;
    };

    /**
     * Returns true if this control has been diposed, otherwise false
     */
    TreeView.prototype.getDisposed = function () {
        return this._isDisposed;
    };

    /**
     * Ensures that the element has the appropriate class applied for this control
     * 
     * @param {HTMLElement} element the element to add the sdl-treeview class to 
     */
    TreeView.prototype.ensureClass = function (element) {
        if (!element.classList.contains('sdl-treeview')) {
            element.classList.add('sdl-treeview');
            this.disposeCallbacks.push(function () {
                this.element.classList.remove('sdl-treeview');
            }.bind(this));
        }
    };

    /**
     * Ensures that the element is tabblable by adding a tabindex of 0 if it doesn't already have one
     * 
     * @param {HTMLElement} element the element to ensure tabbable
     */
    TreeView.prototype.ensureTabbable = function (element) {
        var tabIndex = element.getAttribute('tabindex');
        if (tabIndex === null) {
            element.setAttribute('tabindex', '0');
            this.disposeCallbacks.push(function () {
                this.element.removeAttribute('tabindex');
            }.bind(this));
        }
    };

    /**
     * This render method is required by Lucia/Catalina, see http://jira.global.sdl.corp:8090/confluence/display/DEV/Views+and+controls
     */
    TreeView.prototype.render = function (callback) {
        if (typeof callback === 'function') {
            callback();
        }
    };

    /**
     * Renders the tree into the container element 
     * 
     * @param {HTMLElement} element The html dom node to render the treeview control into
     */
    TreeView.prototype.renderTree = function (element) {
        var ul = document.createElement('ul');
        ul.classList.add('root');
        for (var i = 0; i < this.rootNodes.length; i++) {
            this.renderNode(this.rootNodes[i], ul);
        }
        element.appendChild(ul);

        if (this.useCommonUILibraryScrollView) {
            ul.setAttribute("data-sdl-scrollview-child", 'true');
            this.commonUILibraryScrollView = new SDL.UI.Controls.ScrollView(this.element, {});
            this.disposeCallbacks.push(function () {
                this.commonUILibraryScrollView.dispose();
            }.bind(this));
        }
    };

    /**
     * Renders markup required by the SDL common ui library checkbox CSS
     */
    TreeView.prototype.renderSDLCommonUILibraryCheckbox = function (node, target) {
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        if (!node.isSelectable) {
            checkbox.disabled = true;
        }
        checkbox.checked = node.isSelected;
        checkbox.indeterminate = !node.isSelected && node.isPartiallySelected;
        node.checkbox = checkbox;

        var sdlCheckboxSkin = document.createElement('span');
        sdlCheckboxSkin.classList.add('sdl-checkbox-img');

        var sdlCheckboxContainer = document.createElement('label');
        sdlCheckboxContainer.classList.add('sdl-checkbox');
        sdlCheckboxContainer.appendChild(checkbox);
        sdlCheckboxContainer.appendChild(sdlCheckboxSkin);

        target.appendChild(sdlCheckboxContainer);
    };

    /**
     * Renders a tree node into the target
     * 
     * @param {object} node the treeview node to render
     * @param {HTMLElement} target the target dom node
     */
    TreeView.prototype.renderNode = function (node, target) {
        if (node.isRenderering) {
            return;
        }

        node.isRenderering = true;
        this.setBusyState(node, true);

        var li = document.createElement('li');

        if (this.renderDataIdAttribute) {
            li.setAttribute('data-id', node.id);
        }

        li.setAttribute('data-type', node.dataType);
        li.setAttribute('style', 'text-indent: ' + (node.depth * 19) + 'px');
        if (node.isLeafNode) {
            li.classList.add('leaf-node');
        }

        var div = document.createElement('div');
        div.classList.add('node');

        this.renderLoadingIndicator(div);

        var expandIcon = document.createElement('i');
        expandIcon.classList.add('expand-collapse');
        div.appendChild(expandIcon);

        if (this.multiselectEnabled) {
            this.renderSDLCommonUILibraryCheckbox(node, div);
        }

        var nodeIcon = document.createElement('i');
        nodeIcon.classList.add('node');
        div.appendChild(nodeIcon);

        var content = document.createElement('div');
        content.classList.add('content');
        if (typeof this.nodeContentRenderer === 'function') {
            content.innerHTML = this.nodeContentRenderer(node);
        } else {
            content.textContent = node.name;
        }
        div.appendChild(content);

        li.appendChild(div);

        // set up a two way reference so we can get back to a node from a dom element, and vice versa
        li.node = node;
        target.appendChild(li);
        node.element = li;

        node.isRenderering = false;
        this.setBusyState(node, false);
    };

    /**
     * Renders a loading indicator into the target
     * 
     * @param {HTMLElement} target the target dom node to render into
     */
    TreeView.prototype.renderLoadingIndicator = function (target) {
        var container = document.createElement('div');
        container.classList.add('loader');
        container.innerHTML =
            '<svg class="svg-spinner small" height="16" width="16">' +
                '<circle class="ring" cx="8" cy="8" r="6.5"></circle>' +
                '<path class="arc" d="M8,1.5 a6.5,6.5 0 0,1 6.5,6.5"></path>' +
            '</svg>';

        target.appendChild(container);
    };

    /**
     * Renders the child nodes of a node
     * 
     * @param {Node} node the node to render the children for
     * @param {function} onRendered callback that will fire once the children have rendered
     */
    TreeView.prototype.renderChildNodes = function (node, onRendered) {
        if (!node.hasRendered()) {
            var self = this;
            setTimeout(function () {
                self.renderChildNodes(node, onRendered);
            }, 25);
            return;
        }

        if (node.element.childNodes[1]) {
            if (typeof onRendered === 'function') {
                onRendered();
            }
            return;
        }

        this.setBusyState(node, true);

        if (!node.element.childNodes[1]) {
            var div = document.createElement('div');
            div.classList.add('children');
            var ul = document.createElement('ul');
            for (var i = 0; i < node.children.length; i++) {
                this.renderNode(node.children[i], ul);
            }
            div.appendChild(ul);
            node.element.appendChild(div);
            ul.style.marginTop = -ul.getBoundingClientRect().height + 'px';
        }

        var self = this;
        self.waitForChildren(node, function () {
            self.setBusyState(node, false);
            if (typeof onRendered === 'function') {
                onRendered();
            }
        });
    };

    /**
     * Gets the source element that initiated the DOM event
     * 
     * @param {object} event The DOM event to get the source element for
     */
    TreeView.prototype.getSourceElementFromEvent = function (event) {
        return event.target || event.srcElement;
    };

    /**
     * Gets the LI node corresponding to the row in the treeview containing the element that raised the DOM event
     * 
     * @param {object} event The DOM event to get the LI node for
     */
    TreeView.prototype.getLiNodeElementFromEvent = function (event) {
        var element = this.getSourceElementFromEvent(event);
        while (element && element.nodeName !== "LI") {
            if (element.nodeName === "UL") {
                return null;
            }

            element = element.parentElement;
        }

        return element;
    };

    /**
     * Handles click events in the treeview
     * 
     * @param {object} event The DOM click event
     */
    TreeView.prototype.clickEventHandler = function (event) {
        var source = this.getSourceElementFromEvent(event);
        var li = this.getLiNodeElementFromEvent(event);
        if (li === null) return;
        var node = li.node;

        if (source.classList[0] === 'expand-collapse') {
            this.toggleNode(node);
            return;
        }

        if (source.getAttribute('type') === 'checkbox') {
            if (source.checked) {
                // select this node and all its descendants
                this.selectNode(node);
            } else {
                this.deselectNode(node);
            }
            return;
        }

        // if this is a double click on a node, then toggle the node
        if (this.isDoubleClick(node)) {
            this.toggleNode(node);
        } else {
            // otherwise single click, set this node to the active node    
            this.setActiveNode(node);
        }
    };

    /**
     * True if this node was double clicked, otherwise false
     * 
     * @param {Node} node the node to test
     */
    TreeView.prototype.isDoubleClick = function (node) {
        var doubleClickSpeed = 300;
        var isDoubleClick = false;
        var now = Date.now();
        if (this.lastNodeClicked === node && now - this.lastClicked < doubleClickSpeed) {
            isDoubleClick = true;
            this.lastClicked = null;
        } else {
            this.lastNodeClicked = node;
            this.lastClicked = now;
        }

        return isDoubleClick;
    };

    /**
     * Collapses the parent of this node, or if already collapsed, activates the parent node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.collapseOrActivateParentNode = function (node) {
        if (node.isExpanded) {
            this.collapseNode(node);
        } else {
            this.activateParentNode(node);
        }
    };

    /**
     * Expands the node, or if already expanded, activates the first child node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.expandOrActivateFirstChild = function (node) {
        if (!node.isExpanded) {
            this.expandNode(node);
        } else {
            if (!node.isLeafNode) {
                this.setActiveNode(node.children[0]);
            }
        }
    };

    /**
     * Gets the next sibling of this node, if no next sibling returns null
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.getNextSibling = function (node) {
        if (!node.parent) {
            return null;
        }

        for (var i = 0; i < node.parent.children.length - 1; i++) {
            if (node.parent.children[i] === node) {
                return node.parent.children[i + 1];
            }
        }

        return null;
    };

    /**
     * Gets the previous sibling of this node, if no previous sibling returns null
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.getPreviousSibling = function (node) {
        if (!node.parent) {
            return null;
        }

        for (var i = 1; i < node.parent.children.length; i++) {
            if (node.parent.children[i] === node) {
                return node.parent.children[i - 1];
            }
        }

        return null;
    };

    /**
     * Gets the closest anscestor to this node that has a next sibling
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.getClosestAnscestorNextSibling = function (node) {
        if (!node.parent) {
            return null;
        }

        var parentNextSibling = this.getNextSibling(node.parent);
        if (parentNextSibling) {
            return parentNextSibling;
        }

        return this.getClosestAnscestorNextSibling(node.parent);
    };

    /**
     * Activates the next visible node in the treeview
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.activateNextNode = function (node) {
        // if expanded, select first child
        if (node.isExpanded) {
            this.setActiveNode(node.children[0]);
            return;
        }

        // otherwise, look for subsequent siblings
        var nextSibling = this.getNextSibling(node);
        if (nextSibling) {
            this.setActiveNode(nextSibling);
            return;
        }

        // otherwise look for the closest anscestor with a subsequent sibling
        var parentNextSibling = this.getClosestAnscestorNextSibling(node);
        if (parentNextSibling) {
            this.setActiveNode(parentNextSibling);
            return;
        }
    };

    /**
     * Gets the last visible descendant of this node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.getLastVisibleDescendant = function (node) {
        var lastChild = node.children[node.children.length - 1];
        if (!lastChild.isLeafNode && lastChild.isExpanded) {
            return this.getLastVisibleDescendant(lastChild);
        } else {
            return lastChild;
        }
    };

    /**
     * Activates the previous visible node in the treeview
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.activatePreviousNode = function (node) {
        // look for previous siblings
        var previousSibling = this.getPreviousSibling(node);
        if (previousSibling) {
            // select the last descendant of this sibling that is visible, else select this sibling
            if (!previousSibling.isLeafNode && previousSibling.isExpanded) {
                var lastVisibleDescendant = this.getLastVisibleDescendant(previousSibling);
                this.setActiveNode(lastVisibleDescendant);
            } else {
                this.setActiveNode(previousSibling);
            }

            return;
        }

        // otherwise look for a parent
        this.activateParentNode(node);
    };

    /**
     * Activates the parent node of this node if any
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.activateParentNode = function (node) {
        if (node.parent) {
            this.setActiveNode(node.parent);
        }
    };

    /**
     * Handles keydown events for the treeview control
     * 
     * @param {object} event the DOM event to handle
     */
    TreeView.prototype.keyDownHandler = function (event) {
        switch (event.keyCode) {
            case 37: // left
                this.collapseOrActivateParentNode(this.activeNode);
                event.preventDefault();
                break;
            case 39: // right
                this.expandOrActivateFirstChild(this.activeNode);
                event.preventDefault();
                break;
            case 40: // down
                this.activateNextNode(this.activeNode);
                event.preventDefault();
                break;
            case 38: // up
                this.activatePreviousNode(this.activeNode);
                event.preventDefault();
                break;
            case 8: // backspace
                this.activateParentNode(this.activeNode);
                event.preventDefault();
                break;
            case 13: // enter
                this.toggleNode(this.activeNode);
                event.preventDefault();
                break;
            case 32: // space
                if (this.multiselectEnabled) {
                    if (!this.activeNode.isBusy) {
                        this.toggleSelectedState(this.activeNode);
                    }
                } else {
                    this.toggleNode(this.activeNode);
                }
                event.preventDefault();
                break;
        }
    };

    /**
     * Removes all event listeners added by this treeview control
     */
    TreeView.prototype.removeEventListeners = function () {
        this.element.removeEventListener('click', this.clickEventHandler);
        this.element.removeEventListener('keydown', this.keyDownHandler);
    };

    /**
     * Toggles the selected state of this node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.toggleSelectedState = function (node) {
        if (node.isSelected) {
            this.deselectNode(node);
        } else {
            this.selectNode(node);
        }
    };

    /**
     * Toggles the expanded/collapsed state of this node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.toggleNode = function (node) {
        if (node.isExpanded) {
            this.collapseNode(node);
        } else {
            this.expandNode(node);
        }
    };

    /**
     * Expands the node
     * 
     * @param {Node} node the treeview node
     * @param {function} onExpanded callback that fires once the node is expanded
     */
    TreeView.prototype.expandNode = function (node, onExpanded) {
        var self = this;

        if (node.isLeafNode) {
            if (typeof onExpanded === 'function') {
                onExpanded();
            }
            return;
        }

        if (node.hasLoaded()) {
            if (node.children[0].hasRendered()) {
                self.doNodeExpansion(node, onExpanded);
            } else {
                // render children
                self.renderChildNodes(node, function () {
                    self.doNodeExpansion(node, onExpanded);
                });
            }
        } else {
            // load children
            self.loadChildren(node, function () {
                // render children
                self.renderChildNodes(node, function () {
                    self.doNodeExpansion(node, onExpanded);
                });
            });
        }
    };

    TreeView.prototype.doNodeExpansion = function (node, onExpanded) {
        setTimeout(function () {
            node.isExpanded = true;
            node.element.classList.add('expanded');
            var ul = node.element.children[1].children[0];
            ul.classList.add('slide');
            ul.style.marginTop = 0;
            if (typeof onExpanded === 'function') {
                onExpanded();
            }
        }, 25);
    };

    /**
     * Loads the children of the node
     * 
     * @param {Node} node the treeview node
     * @param {function} onLoaded callback that fires once the children have loaded
     */
    TreeView.prototype.loadChildren = function (node, onLoaded) {
        var self = this;

        if (node.isLeafNode || node.hasLoaded()) {
            if (typeof onLoaded === 'function') {
                onLoaded();
            }
            return;
        }

        if (node.isLoading) {
            setTimeout(function () {
                self.loadChildren(node, onLoaded);
            }, 25);
            return;
        }
        node.isLoading = true;
        this.setBusyState(node, true);

        node.load(node, function (children) {
            if (children && children.length > 0) {
                node.children = children;
            } else {
                node.children = [];
                node.isLeafNode = true;
                if (node.hasRendered()) {
                    node.element.classList.add('leaf-node');
                }
            }

            if (typeof onLoaded === 'function') {
                onLoaded();
            }

            self.waitForChildren(node, function () {
                node.isLoading = false;
                self.setBusyState(node, false);
            });
        });
    };

    /**
     * Recursively loads all the descendants of the node
     * 
     * @param {Node} node the treeview node
     * @param {function} onLoaded callback that fires once all the descendants have loaded
     */
    TreeView.prototype.loadDescendants = function (node, onLoaded) {
        var self = this;
        if (node.isLoading) {
            setTimeout(function () {
                self.loadDescendants(node, onLoaded);
            }, 25);
            return;
        }

        if (node.isLeafNode || node.hasLoaded()) {
            node.isLoading = false;
            if (typeof onLoaded === 'function') {
                onLoaded();
            }
            return;
        }

        node.isLoading = true;
        this.setBusyState(node, true);

        var self = this;
        node.load(node, function (children) {
            if (children && children.length > 0) {
                node.children = children;
                for (var i = 0; i < children.length; i++) {
                    if (!children[i].hasLoaded() && !children[i].isLeafNode) {
                        self.loadDescendants(children[i], function () {
                            node.isLoading = false;
                            self.setBusyState(node, false);
                        });
                    }
                }

                self.waitForChildren(node, function () {
                    node.isLoading = false;
                    self.setBusyState(node, false);
                    if (typeof onLoaded === 'function') {
                        onLoaded();
                    }
                });
            } else {
                node.children = [];
                node.isLeafNode = true;
                if (node.hasRendered()) {
                    node.element.classList.add('leaf-node');
                }

                node.isLoading = false;
                self.setBusyState(node, false);
                if (typeof onLoaded === 'function') {
                    onLoaded();
                }
            }
        });
    };

    /**
     * Sets the busy state of the node
     * 
     * @param {Node} node the treeview node
     * @param {boolean} busy the busy state to set
     */
    TreeView.prototype.setBusyState = function (node, busy) {
        if (busy) {
            if (this.multiselectEnabled && node.checkbox) {
                node.checkbox.disabled = true;
            }

            if (!node.isBusy) {
                if (node.element) {
                    node.element.classList.add('busy');
                }

                this.busyCount++;
                node.isBusy = true;
            }
        } else {
            if (this.multiselectEnabled && node.checkbox && node.isSelectable) {
                node.checkbox.disabled = false;
            }

            if (node.isBusy) {
                if (node.element) {
                    node.element.classList.remove('busy');
                }

                this.busyCount--;
                node.isBusy = false;
            }
        }
    };

    /**
     * Waits for all the children of the node to be ready, then fires onReady
     * 
     * @param {Node} node the treeview node
     * @param {function} onReady callback that fires once all the children are ready
     */
    TreeView.prototype.waitForChildren = function (node, onReady) {
        var ready = true;
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].isBusy) {
                ready = false;
                break;
            }
        }

        if (ready) {
            onReady();
        } else {
            var self = this;
            setTimeout(function () {
                self.waitForChildren(node, onReady);
            }, 25);
        }
    };

    /**
     * Collapses the node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.collapseNode = function (node) {
        if (node.isLoading) {
            return;
        }

        node.element.classList.remove('expanded');
        var ul = node.element.children[1].children[0];
        ul.style.marginTop = -ul.getBoundingClientRect().height + 'px';
        node.isExpanded = false;

        // if this node contains the active node, then activate this node instead
        if (this.activeNodeIdPath.indexOf(node.getPath()) > -1) {
            this.setActiveNode(node);
        }
    };

    /**
     * Sets the selected state of the ancestors of the node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.setSelectedStateOfAncestors = function (node) {
        var parent = node.parent;
        if (!parent) {
            return;
        }

        var parentIsFullySelected = true;
        var parentIsPartiallySelected = false;
        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].isSelected || parent.children[i].isPartiallySelected) {
                parentIsPartiallySelected = true;
            }

            if (!parent.children[i].isSelected) {
                parentIsFullySelected = false;
            }
        }

        if (parentIsFullySelected !== parent.isSelected || parentIsPartiallySelected !== parent.isPartiallySelected) {
            parent.isSelected = parentIsFullySelected;
            parent.isPartiallySelected = parentIsPartiallySelected;
            this.setCheckboxState(parent);
            this.queueSelectionChanged();
            this.setSelectedStateOfAncestors(parent);
        }
    };

    /**
     * Sets the associated checkbox state for this node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.setCheckboxState = function (node) {
        if (!node.hasRendered()) {
            return;
        }

        node.checkbox.checked = node.isSelected;
        node.checkbox.indeterminate = !node.isSelected && node.isPartiallySelected;
    };

    /**
     * Selects a collection of nodes by path
     * 
     * @param {array} paths the collection of paths to select
     */
    TreeView.prototype.selectNodesByPath = function (paths) {
        for (var i = 0; i < paths.length; i++) {
            this.selectNodeByPath(paths[i]);
        }
    };

    /**
     * Selects a node by path
     * 
     * @param {string} path the path to the node to select
     */
    TreeView.prototype.selectNodeByPath = function (path) {
        var self = this;
        this.loadPath(path, function (node) {
            self.selectNode(node);
        });
    };

    /**
     * Loads the path
     * 
     * @param {string} path the path to load
     * @param {function} onComplete callback to invoke once the path has fully loaded
     */
    TreeView.prototype.loadPath = function (path, onComplete) {
        this.loadDescendantsByIds(null, path.split('/'), onComplete);
    };

    /**
     * Recursively loads the descendants of the node
     * 
     * @param {Node} node the node to start at (if null, starts at the collection of rootNodes)
     * @param {array} descendantIds ids of the descendants of the node to load
     * @param {function} onComplete callback to invoke once the descendants have fully loaded
     */
    TreeView.prototype.loadDescendantsByIds = function (node, descendantIds, onComplete) {
        var self = this;

        var children;
        if (node) {
            if (node.isLeafNode) {
                return;
            }

            if (node.hasLoaded()) {
                children = node.children;
            } else {
                self.loadChildren(node, function () {
                    self.loadDescendantsByIds(node, descendantIds, onComplete);
                });
                return;
            }
        } else {
            children = self.rootNodes;
        }

        var match;
        var id = descendantIds.shift();
        for (var i = 0; i < children.length; i++) {
            if (children[i].id === id) {
                match = children[i];
                break;
            }
        }

        if (match) {
            if (descendantIds.length > 0) {
                self.loadDescendantsByIds(match, descendantIds, onComplete);
            } else {
                if (typeof onComplete === 'function') {
                    onComplete(match);
                }
            }
        }
    };

    /**
     * Selects a collection of nodes when in multiselect mode
     * 
     * @param {array} nodes the collection of nodes to select
     */
    TreeView.prototype.selectNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.selectNode(nodes[i]);
        }
    };

    /**
     * Selects the node
     * 
     * @param {Node} node the treeview node
     * @param {boolean} suppressAncestorSelectionStateCheck true if we should suppress the ancestor selection state check for this operation, otherwise false
     */
    TreeView.prototype.selectNode = function (node, suppressAncestorSelectionStateCheck) {
        if (this.multiselectEnabled) {
            if (!node.isSelectable || node.isSelected) {
                return;
            }

            this.setBusyState(node, true);

            // select this node and all its descendants
            node.isSelected = true;
            this.setCheckboxState(node);
            this.queueSelectionChanged();

            // correct ancestor checked states (partial checked, fully checked, etc)
            if (!suppressAncestorSelectionStateCheck) {
                this.setSelectedStateOfAncestors(node);
            }

            var self = this;
            if (node.hasLoaded()) {
                if (node.isLeafNode) {
                    self.setBusyState(node, false);
                } else {
                    for (var i = 0; i < node.children.length; i++) {
                        self.selectNode(node.children[i], true); // don't check anscestors because the parent node intiated this chain of events so the parent node will already have checked them for us
                    }

                    self.waitForChildren(node, function () {
                        self.setBusyState(node, false);
                    });
                }
            } else {
                self.loadDescendants(node, function () {
                    if (node.isLeafNode) {
                        self.setBusyState(node, false);
                    } else {
                        for (var i = 0; i < node.children.length; i++) {
                            self.selectNode(node.children[i], true); // don't check anscestors because the parent node intiated this chain of events so the parent node will already have checked them for us
                        }

                        self.waitForChildren(node, function () {
                            self.setBusyState(node, false);
                        });
                    }
                });
            }
        } else {
            this.setActiveNode(node);
        }
    };

    /**
     * Deselects a collection of nodes
     * 
     * @param {array} nodes the collection of treeview nodes to deselect
     */
    TreeView.prototype.deselectNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.deselectNode(nodes);
        }
    };

    /**
     * Deselects the node
     * 
     * @param {Node} node the treeview node
     * @param {boolean} suppressAncestorSelectionStateCheck true if we should suppress the ancestor selection state check for this operation, otherwise false
     */
    TreeView.prototype.deselectNode = function (node, suppressAncestorSelectionStateCheck) {
        if (!this.multiselectEnabled) {
            return;
        }

        this.setBusyState(node, true);
        node.isSelected = false;
        node.isPartiallySelected = false;
        this.setCheckboxState(node);
        this.queueSelectionChanged();

        if (!node.isLeafNode) {
            // also deselect all the descendants of this node
            for (var i = 0; i < node.children.length; i++) {
                this.deselectNode(node.children[i], true); // don't check anscestors because the parent node intiated this chain of events so the parent node will already have checked them for us
            }
        }

        if (!suppressAncestorSelectionStateCheck) {
            this.setSelectedStateOfAncestors(node);
        }

        if (node.isLeafNode) {
            this.setBusyState(node, false);
        } else {
            var self = this;
            self.waitForChildren(node, function () {
                self.setBusyState(node, false);
            });
        }
    };

    /**
     * Expands all the descendants of the node that match the list of descendantIds where the index of the descendantIds array corresponds to the depth from this node
     * 
     * @param {Node} node the treeview node
     * @param {array} descendantIds an array of ids that will be used to match recursively against children of this node to do the expansion
     * @param {function} onComplete a callback that will fire once all the nodes have been expanded
     */
    TreeView.prototype.expandDescendantsByIds = function (node, descendantIds, onComplete) {
        var self = this;

        var children;
        if (node) {
            if (node.isLeafNode) {
                return;
            }

            if (node.hasLoaded()) {
                if (node.hasRendered()) {
                    children = node.children;
                } else {
                    setTimeout(function () {
                        self.expandDescendantsByIds(node, descendantIds, onComplete);
                    }, 25);
                    return;
                }
            } else {
                self.loadChildren(node, function () {
                    self.expandDescendantsByIds(node, descendantIds, onComplete);
                });
                return;
            }
        } else {
            children = self.rootNodes;
        }

        var match;
        var id = descendantIds.shift();
        for (var i = 0; i < children.length; i++) {
            if (children[i].id === id) {
                match = children[i];
                break;
            }
        }

        if (match) {
            self.setActiveNode(match);
            if (descendantIds.length > 0) {
                self.expandNode(match, function () {
                    self.expandDescendantsByIds(match, descendantIds, onComplete);
                });
            } else {
                if (typeof onComplete === 'function') {
                    onComplete(match);
                }
            }
        }
    };

    /**
     * Sets the active node to the node whose id matches the final value in the ancestryIds array
     * 
     * @param {array} ancestryIds an array of ids to use to find the node in the tree to activate, starting at the root nodes
     */
    TreeView.prototype.setActiveNodeByAncestryIds = function (ancestryIds) {
        var self = this;

        if (self.settingActiveNodeByAncestryIds) {
            // prevent key board rattling, fast clicks and code loops calling setActiveNodeByAncestryIds...
            return;
        }

        self.settingActiveNodeByAncestryIds = true;
        self.expandDescendantsByIds(null, ancestryIds, function (node) {
            self.setActiveNode(node);
            self.settingActiveNodeByAncestryIds = false;
        });
    };

    /**
     * Sets the active node by path
     * 
     * @param {string} path the path to the node to activate
     */
    TreeView.prototype.setActiveNodeByPath = function (path) {
        var ancestryIds = path.split('/');
        this.setActiveNodeByAncestryIds(ancestryIds);
    };

    /**
     * Sets the currently active node to be the specified node
     * 
     * @param {Node} node the treeview node
     */
    TreeView.prototype.setActiveNode = function (node) {
        var self = this;

        if (!node.hasRendered()) {
            if (node.expandingAncestry) {
                // prevent key board rattling, fast clicks and code loops calling setActiveNode...
                return;
            }

            node.expandingAncestry = true;
            var ancestryIds = [];
            ancestryIds.push(node.id);
            var parent = node.parent;
            while (parent) {
                ancestryIds.unshift(parent.id);
                parent = parent.parent;
            }
            this.expandDescendantsByIds(null, ancestryIds, function () {
                self.setActiveNode(node);
                node.expandingAncestry = false;
            });
            return;
        }

        var activeNodeChanged = this.activeNode !== node;
        if (activeNodeChanged) {
            if (typeof this.activeNode !== 'undefined') {
                this.activeNode.element.classList.remove('active');
            }

            this.activeNode = node;
            this.activeNode.element.classList.add('active');
            this.activeNodeIdPath = node.getPath();

            if (!this.multiselectEnabled) {
                this.selectedNodes[0] = node;
                this.queueSelectionChanged();
            }

            if (this.useCommonUILibraryScrollView) {
                utils.scrollIntoView(this.element.childNodes[0], node.element.childNodes[0], parseInt(this.element.childNodes[0].style.bottom));
            } else {
                utils.scrollIntoView(this.element, node.element.childNodes[0]);
            }
        }
    };

    /**
     * Creates a node
     * 
     * @param {string} id A Unique identifier for this node
     * @param {string} name A localised string to display for the node
     * @param {string} dataType Used to populate the 'data-type' attribute on an html node element so different styles can be applied
     * @param {array} parent The parent of this node
     * @param {boolean} isLeafNode True if this is a leaf node (contains no child nodes) 
     * @param {array} children A preloaded collection of children of type Node
     * @param {function(callback)} load A function that returns in the callback all the child nodes for the node, returns {array} of Node
     * @param {boolean} isSelectable true if this node is selectable, otherwise false (defaults to true)
     */
    TreeView.prototype.createNode = function (id, name, dataType, parent, children, isLeafNode, load, isSelectable) {
        return new Node(id, name, dataType, parent, children, isLeafNode, load, isSelectable);
    };

    /**
     * Convenience method for creating a node from an object definition instead of passing a parameter list
     * 
     * @param {object} data the data object containing the required properties of a node, c.f. TreeView.prototype.createNode
     */
    TreeView.prototype.createNodeFromObject = function (data) {
        return this.createNode(data.id, data.name, data.dataType, data.parent, data.children, data.isLeafNode, data.load, data.isSelectable);
    };

    return TreeView;
}());