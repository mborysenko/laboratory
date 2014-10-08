/* 
 * The MIT License
 *
 * Copyright (c) 2014 Tony Leeper
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function () {
    function getContentElementFromInput(input) {
        return input.parentElement.getElementsByTagName('placeholder-shim-content')[0];
    }

    function updatePlaceholderText(input, placeholderText) {
        var content = getContentElementFromInput(input);
        content.childNodes[0].nodeValue = placeholderText;
    }

    function applyPlaceholderShim(input) {
        var placeholderText = input.getAttribute('placeholder');
        if (placeholderText === null || typeof placeholderText === 'undefined') {
            if (input.placeholderShimIsBound) {
                updatePlaceholderText(input, '');
            }
            return;
        }

        if (input.placeholderShimIsBound) {
            updatePlaceholderText(input, placeholderText);
            input.placeholderShim_setPlaceholderVisibility();
            return;
        }

        var currentStyle = window.getComputedStyle(input);
        var paddingTop = currentStyle.paddingTop;
        var paddingRight = currentStyle.paddingRight;
        var paddingBottom = currentStyle.paddingBottom;
        var paddingLeft = currentStyle.paddingLeft;
        var shim = document.createElement('placeholder-shim');
        var content = document.createElement('placeholder-shim-content');
        var text = document.createTextNode(placeholderText);
        content.appendChild(text);
        shim.appendChild(content);
        shim.setAttribute('style', 'display: inline-block; position: relative; cursor: text');
        var height = input.getBoundingClientRect().height;
        var rightOffset = 2 + parseInt(paddingRight, 10);
        content.setAttribute('style',
            'position: absolute;  color: #a0a0a0; padding-top: ' + paddingTop + '; padding-right: ' + paddingRight +
            '; padding-bottom: ' + paddingBottom + '; padding-left: ' + paddingLeft + '; top: 0; left: 2px; right: ' +
            rightOffset + 'px; overflow: hidden;  cursor: text; height: ' + height + 'px; line-height: ' + height + 'px');
        wrap(input, shim);

        input.placeholderShim_hidePlaceholder = function () {
            content.style.display = 'none';
        };
        input.addEventListener('focus', input.placeholderShim_hidePlaceholder);

        input.placeholderShim_setPlaceholderVisibility = function () {
            if (document.activeElement !== input && input.value === '') {
                content.style.display = 'inline-block';
            } else {
                content.style.display = 'none';
            }
        };
        input.addEventListener('blur', input.placeholderShim_setPlaceholderVisibility);

        input.placeholderShim_onMouseDownHandler = function (e) {
            input.focus();
            e.preventDefault();
        };
        content.addEventListener('mousedown', input.placeholderShim_onMouseDownHandler);

        // set initial visibility in case the input already has a value
        input.placeholderShim_setPlaceholderVisibility();

        input.placeholderShimIsBound = true;
    }

    function destroy(input) {
        input.removeEventListener('focus', input.placeholderShim_hidePlaceholder);
        input.removeEventListener('blur', input.placeholderShim_setPlaceholderVisibility);
        var content = getContentElementFromInput(input);
        content.removeEventListener('mousedown', input.placeholderShim_onMouseDownHandler);

        input.setPlaceholderVisibility = null;
        input.placeholderShimVisibilityInterval = null;
        input.placeholderShimIsBound = null;
    }

    function wrap(elms, withElement) {
        // Convert `elms` to an array, if necessary.
        if (!elms.length) elms = [elms];

        // Loops backwards to prevent having to clone the wrapper on the
        // first element (see `child` below).
        for (var i = elms.length - 1; i >= 0; i--) {
            var child = (i > 0) ? withElement.cloneNode(true) : withElement;
            var el = elms[i];

            // Cache the current parent and sibling.
            var parent = el.parentNode;
            var sibling = el.nextSibling;

            // Wrap the element (is automatically removed from its current
            // parent).
            child.appendChild(el);

            // If the element had a sibling, insert the wrapper before
            // the sibling to maintain the HTML structure; otherwise, just
            // append it to the parent.
            if (sibling) {
                parent.insertBefore(child, sibling);
            } else {
                parent.appendChild(child);
            }
        }
    }

    function nativePlaceHolderSupport() {
        var test = document.createElement('input');
        return ('placeholder' in test);
    }

    function hasOrIsDescendant(node, descendant) {
        if (node === descendant) {
            return true;
        }

        for (var i = 0; i < node.children.length; i++) {
            if (hasOrIsDescendant(node.children[i], descendant)) {
                return true;
            }
        }

        return false;
    }

    function checkForInputDisposal(e) {
        var inputs = document.getElementsByTagName('input');
        Array.prototype.forEach.call(inputs, function (input) {
            if (input.placeholderShimIsBound && hasOrIsDescendant(e.srcElement, input)) {
                destroy(input);
            }
        });
    }

    function init() {
        if (!nativePlaceHolderSupport()) {
            var busy;
            var inputs = document.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                applyPlaceholderShim(inputs[i]);
            }
            setInterval(function () {
                if (busy) {
                    return;
                }
                busy = true;
                inputs = document.getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    applyPlaceholderShim(inputs[i]);
                }
                busy = false;
            }, 100);

            document.addEventListener('DOMNodeRemoved', checkForInputDisposal);
        }
    }

    init();
}());