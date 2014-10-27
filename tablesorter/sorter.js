var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.derachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancalBubble = true;
        }
    }
};

function sortTable(tab, ro, met) {
    var table = document.getElementById(tab);
    var row = table.rows.length;
    for (var i = 1; i < row-1; i++) {
        var k = i;
        for (var j = i+1; j < row; j++) {
            if (met == 'inc') {
                if (table.rows[k].cells[ro].innerHTML > table.rows[j].cells[ro].innerHTML)
                    k = j;
            } else {
                if (table.rows[k].cells[ro].innerHTML < table.rows[j].cells[ro].innerHTML)
                    k = j;
            }
        }
        if (k>i) {
            tmp=table.rows[i].innerHTML;
            table.rows[i].innerHTML=table.rows[k].innerHTML;
            table.rows[k].innerHTML=tmp;
        }
    }
}

function addEl(tbid, id, headid) {
    var item = document.getElementById(id);
    EventUtil.addHandler(item, 'click', function(event){
        EventUtil.preventDefault(event);
        var list = document.getElementById(headid);
        var walker = document.createTreeWalker(list, NodeFilter.SHOW_ELEMENT, null, false);
        var node = walker.firstChild();
        while(node !== null) {
            if (node !== item) {
                removeClass(node, 'inc');
                removeClass(node, 'dec');
            }
            node = walker.nextSibling();
        }
        if (hasClass(item, 'dec')) {
            removeClass(item, 'dec');
            addClass(item, 'inc');
            var idex = itemIndex(item, headid);
            sortTable(tbid, idex, 'inc');
        } else if (hasClass(item, 'inc')) {
            removeClass(item, 'inc');
            addClass(item, 'dec');
            var idex = itemIndex(item, headid);
            sortTable(tbid, idex, 'dec');
        } else {
            addClass(item, 'inc');
            var idex = itemIndex(item, headid);
            console.log(idex);
            sortTable(tbid, idex, 'inc');
        }
    });
}

function addClass(element, value) {
    if (!this.hasClass(element, value)) {
        element.className = value;
    } else {
        element.className += ' '+value;
    }
}

function itemIndex(element, father) {
    var fa = document.getElementById(father);
    var i = 0;
    for (i = 0; i < fa.childNodes.length; i++) {
        if (fa.childNodes.item(i) == element) {
            return (i-1)/2;
        }
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

window.onload = function() {
    addEl('todo', 'what', 'head');
    addEl('todo', 'when', 'head');
    addEl('todo', 'location', 'head');
    addEl('staff', 'fn', 'staffhead');
    addEl('staff', 'ln', 'staffhead');
    addEl('staff', 'lc', 'staffhead');
}; 
