var swi = document.getElementById('switcher');

swi.onclick = function() {
    toggleClass(swi, 'fa-toggle-on');
};

function addClass(element, value) {
    if (!this.hasClass(element, value)) {
        element.className += ' ' + value;
    }
}

function removeClass(element, value) {
    if (hasClass(element, value)) {
        var reg = new RegExp('(\\s|^)'+value+'(\\s|$)');
        element.className = element.className.replace(reg, '');
    }
}

function hasClass(element, value) {
    return element.className.match(new RegExp('(\\s|^)'+value+'(\\s|$)'));
}

function toggleClass(element, value) {
    if (hasClass(element, value)) {
        removeClass(element, value);
        var list = document.getElementById('list');
        removeClass(list, 'reverseList');
        var walker = document.createTreeWalker(list, NodeFilter.SHOW_ELEMENT, null, false);
        var node = walker.firstChild();
        while(node !== null) {
            removeClass(node, 'reverse');
            node = walker.nextSibling();
        }
    } else {
        addClass(element, value);
        var list = document.getElementById('list');
        addClass(list, 'reverseList');
        var walker = document.createTreeWalker(list, NodeFilter.SHOW_ELEMENT, null, false);
        var node = walker.firstChild();
        while(node !== null) {
            addClass(node, 'reverse');
            node = walker.nextSibling();
        }
    }
}