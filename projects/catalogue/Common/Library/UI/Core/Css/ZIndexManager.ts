module SDL.UI.Core.Css.ZIndexManager
{
	export var baseZIndex = 100;

	interface IZIndexedElement
	{
		element: HTMLElement;
		zIndex: number;
		isTopmost?: boolean;
		parent: IZIndexedElement;
		zIndexedElements: IZIndexedElement[];
		topmostElements?: IZIndexedElement[];
	}

	var rootElement: IZIndexedElement = {
				element: document.body,
				zIndex: -1,
				parent: null,
				zIndexedElements: []
			};

	var allZIndexedElements: IZIndexedElement[] = [];

	export function setNextZIndex(element: HTMLElement, bringToFront: boolean = false)
	{
		// find closest z-indexed ancestor element
		var closestParentElement: IZIndexedElement = rootElement;
		var parentElement: IZIndexedElement = findParentZIndexedElement(element, rootElement.zIndexedElements)
												|| (rootElement.topmostElements && findParentZIndexedElement(element, rootElement.topmostElements));
		while (parentElement)
		{
			closestParentElement = parentElement;
			parentElement = findParentZIndexedElement(element, parentElement.zIndexedElements)
												|| (parentElement.topmostElements && findParentZIndexedElement(element, parentElement.topmostElements));
		}

		var entry: IZIndexedElement;
		var parentZIndexedElements: IZIndexedElement[];
		var parentTopmostElements: IZIndexedElement[];
		
		if (closestParentElement.element == element)	// element is already z-indexed
		{
			var index: number;
			var i: number;

			entry = closestParentElement;
			parentZIndexedElements = entry.parent.zIndexedElements;
			parentTopmostElements = entry.parent.topmostElements;

			if (entry.isTopmost)
			{
				index = parentTopmostElements.indexOf(entry);
				if (bringToFront)
				{
					// topmost -> topmost
					if (index != parentTopmostElements.length - 1)
					{
						moveZIndexes(entry.zIndex, getMaximalZIndex(entry, true), getMaximalZIndex(entry.parent, true));
						for (i = index + 1; i < parentTopmostElements.length; i++)
						{
							parentTopmostElements[i - 1] = parentTopmostElements[i];
						}
						parentTopmostElements[parentTopmostElements.length - 1] = entry;
					}
				}
				else
				{
					// topmost -> ordinary zIndexed
					moveZIndexes(entry.zIndex, getMaximalZIndex(entry, true), getMaximalZIndex(entry.parent, false));
					entry.isTopmost = false;
					parentTopmostElements.splice(index, 1);
					parentZIndexedElements.push(entry);
				}
			}
			else
			{
				index = parentZIndexedElements.indexOf(entry);
				if (bringToFront)
				{
					// ordinary zIndexed -> topmost
					moveZIndexes(entry.zIndex, getMaximalZIndex(entry, true), getMaximalZIndex(entry.parent, true));
					entry.isTopmost = true;
					parentZIndexedElements.splice(index, 1);
					if (!parentTopmostElements)
					{
						entry.parent.topmostElements = [entry];
					}
					else
					{
						parentTopmostElements.push(entry);
					}
				}
				else
				{
					// ordinary zIndexed -> ordinary zIndexed
					if (index != parentZIndexedElements.length - 1)
					{
						moveZIndexes(entry.zIndex, getMaximalZIndex(entry, true), getMaximalZIndex(entry.parent, false));
						for (i = index + 1; i < parentZIndexedElements.length; i++)
						{
							parentZIndexedElements[i - 1] = parentZIndexedElements[i];
						}
						parentTopmostElements[parentZIndexedElements.length - 1] = entry;
					}
				}
			}
		}
		else	// element is not z-indexed
		{
			// element might be z-indexed with insertZIndexBefore -> release it first
			releaseZIndex(element);

			entry = registerZIndexedElement(element, closestParentElement, getMaximalZIndex(closestParentElement, bringToFront), bringToFront);

			if (bringToFront)	// topmost
			{
				if (!closestParentElement.topmostElements)
				{
					closestParentElement.topmostElements = [entry];
				}
				else
				{
					closestParentElement.topmostElements.push(entry);
				}
			}
			else	// ordinary z-indexed
			{
				// show the target as the topmost z-indexed element within the parent
				closestParentElement.zIndexedElements.push(entry);
			}
		}
	}

	export function getZIndex(element: HTMLElement): number
	{
		for (var i = allZIndexedElements.length - 1; i >= 0; i--)
		{
			if (allZIndexedElements[i].element == element)
			{
				return allZIndexedElements[i].zIndex + baseZIndex;
			}
		}
	}

	export function insertZIndexBefore(element: HTMLElement, beforeElement: HTMLElement)
	{
		if (element && beforeElement && element != beforeElement)
		{
			for (var i = allZIndexedElements.length - 1; i >= 0; i--)
			{
				if (allZIndexedElements[i].element == beforeElement)
				{
					var beforeZIndexedElement = allZIndexedElements[i];

					for (var j = allZIndexedElements.length - 1; j >= 0; j--)
					{
						if (allZIndexedElements[j].element == element)
						{
							// element is already z-indexed
							var prevZIndexedElement = allZIndexedElements[j];
							if (prevZIndexedElement.parent)
							{
								if (prevZIndexedElement.parent != beforeZIndexedElement.parent)
								{
									// element is already z-indexed and has a different parent -> can't insert
									throw Error("insertZIndexBefore: can't set z-index before another element from a different z-index parent");
								}

								throw Error("insertZIndexBefore: changing z-index for elements that are already z-indexed is not implemented yet.");
							}
							else
							{
								// element has no parent, good, just reorder
								moveZIndexes(prevZIndexedElement.zIndex, prevZIndexedElement.zIndex, beforeZIndexedElement.zIndex - 1);
							}
							return;
						}
					}

					//element is not z-indexed yet
					registerZIndexedElement(element, null, beforeZIndexedElement.zIndex - 1);
					return;
				}
			}
		}
	}

	export function releaseZIndex(element: HTMLElement)
	{
		for (var i = allZIndexedElements.length - 1; i >= 0; i--)
		{
			if (allZIndexedElements[i].element == element)
			{
				var entry = allZIndexedElements[i];
				var parent = entry.parent;

				if (parent)
				{
					var index: number = parent.zIndexedElements.indexOf(entry);

					if (index != -1)
					{
						parent.zIndexedElements.splice(parent.zIndexedElements.indexOf(entry), 1);
					}
					else if (parent.topmostElements)
					{
						index = parent.topmostElements.indexOf(entry);
						if (index != -1)
						{
							parent.topmostElements.splice(parent.topmostElements.indexOf(entry), 1);
						}
					}
				}

				removeZIndexes(i, getMaximalZIndex(entry, true));
				return;
			}
		}
	}

	function findParentZIndexedElement(element: HTMLElement, zIndexedElements: IZIndexedElement[])
	{
		for (var i = zIndexedElements.length - 1; i >= 0; i--)
		{
			if (zIndexedElements[i].element.contains(element))
			{
				return zIndexedElements[i];
			}
		}
	}

	function getMaximalZIndex(zIndexedElement: IZIndexedElement, checkTopmostElements: boolean): number
	{
		if (checkTopmostElements && zIndexedElement.topmostElements && zIndexedElement.topmostElements.length)
		{
			return getMaximalZIndex(zIndexedElement.topmostElements[zIndexedElement.topmostElements.length - 1], true);
		}
		else if (zIndexedElement.zIndexedElements.length)
		{
			return getMaximalZIndex(zIndexedElement.zIndexedElements[zIndexedElement.zIndexedElements.length - 1], checkTopmostElements);
		}
		else
		{
			return zIndexedElement.zIndex;
		}
	}

	function registerZIndexedElement(element: HTMLElement, parent: IZIndexedElement, afterZIndex: number, isTopmost: boolean = false)
	{
		var entry: IZIndexedElement = {
				element: element,
				zIndex: afterZIndex + 1,
				isTopmost: isTopmost,
				parent: parent,
				zIndexedElements: [],
				topmostElements: null
			};

		setAfterZIndex(entry, afterZIndex);
		return entry;
	}

	function setAfterZIndex(entry: IZIndexedElement, afterZIndex: number)
	{
		var zIndex = afterZIndex + 1;
		for (var i = allZIndexedElements.length; i > zIndex; i--)
		{
			var moveEntry = allZIndexedElements[i - 1];
			allZIndexedElements[i] = moveEntry;
			moveEntry.element.style.zIndex = (++moveEntry.zIndex + baseZIndex).toString();
		}
		allZIndexedElements[zIndex] = entry;
		entry.element.style.zIndex = ((entry.zIndex = zIndex) + baseZIndex).toString();
	}

	function removeZIndexes(zIndexStart: number, zIndexEnd: number)
	{
		var zIndexCount = zIndexEnd - zIndexStart + 1;
		for (var i = zIndexEnd + 1; i < allZIndexedElements.length; i++)
		{
			var moveEntry = allZIndexedElements[i];
			allZIndexedElements[i - zIndexCount] = moveEntry;
			moveEntry.element.style.zIndex = ((moveEntry.zIndex -= zIndexCount) + baseZIndex).toString();
		}
		allZIndexedElements.splice(allZIndexedElements.length - zIndexCount, zIndexCount);
	}

	function moveZIndexes(zIndexStart: number, zIndexEnd: number, afterZIndex: number)
	{
		if (zIndexStart > afterZIndex)
		{
			moveZIndexes(afterZIndex + 1, zIndexStart - 1, zIndexEnd);
		}
		else
		{
			var distance = afterZIndex - zIndexEnd;
			if (distance > 0)
			{
				var zIndexCount = zIndexEnd - zIndexStart + 1;
				if (zIndexCount)
				{
				
					for (var i = zIndexStart; i <= zIndexEnd; i++)
					{
						allZIndexedElements[i].element.style.zIndex = ((allZIndexedElements[i].zIndex = i + distance) + baseZIndex).toString();
					}

					for (i = zIndexEnd + 1; i <= afterZIndex; i++)
					{
						allZIndexedElements[i].element.style.zIndex = ((allZIndexedElements[i].zIndex = i - zIndexCount) + baseZIndex).toString();
					}

					allZIndexedElements.splice.bind(allZIndexedElements, zIndexStart, 0).apply(null, allZIndexedElements.splice(zIndexEnd + 1, distance));
				}
			}
		}
	}
} 