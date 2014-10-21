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

var droptarget = document.getElementById("tar");
var dragg = document.getElementById("container");

EventUtil.addHandler(droptarget, "dragover", function(event){
    EventUtil.preventDefault(event);
});

EventUtil.addHandler(droptarget, "dragenter", function(event){
    EventUtil.preventDefault(event);
});

EventUtil.addHandler(dragg, "dragstart", function(event) {
    event.dataTransfer.setData("text", dragg.id);
});

EventUtil.addHandler(dragg, "drag", function(event) {
    droptarget.style.backgroundColor = "#222";
});

EventUtil.addHandler(dragg, "dragend", function(event) {
    droptarget.style.background = "transparent";
});

EventUtil.addHandler(droptarget, "drop", function(event){
    var he = event.dataTransfer.getData("text");
    var x = event.clientX;
    var y = event.clientY;
    var container = document.getElementById(he);
    var cont = document.getElementById("cc");
    container.style.top = y;
    container.style.left = x;
    droptarget.appendChild(document.getElementById(he));
});

EventUtil.addHandler(dragg, "mouseover", function(event) {
    dragg.style.left = dragg.offsetLeft - 50;
    dragg.style.top = dragg.offsetTop - 50;
});
EventUtil.addHandler(dragg, "mouseout", function(event) {
    dragg.style.left = dragg.offsetLeft + 50;
    dragg.style.top = dragg.offsetTop + 50;
});
