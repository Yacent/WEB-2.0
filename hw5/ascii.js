window.onload = function() {
    'use strict';
    var index     = 0,
        minDelay  = 50,
        maxDelay  = 200,
        lastAni, timer;
    var sizeArr = ["7pt", "12pt", "24pt"];   

    var startBtn    = document.getElementsByName("start")[0],
        stopBtn     = document.getElementsByName("stop")[0],
        displayArea = document.getElementById("displayarea"),
        select      = document.getElementsByTagName("select")[0];

    var isTurbo = function() {
        var turbo = document.getElementsByName("speed")[0];
        return turbo.checked;
    };

    var getSize = function() {
        var sizeRadio = document.getElementsByName("size"),
            idx       = 0;

        for (var i = 0; i < sizeRadio.length; i++) {
            if (sizeRadio[i].checked) {
                idx = i;
                break;
            }
        }
        return sizeArr[idx];
    };

    startBtn.onclick = function() {     
        var animation = select.value,
            frameList = ANIMATIONS[animation].split("=====\n");

        var play = function() {
            index = index >= frameList.length-1 ? 0 : index+1;
            displayArea.value = frameList[index];
            displayArea.style.fontSize = getSize();
            var delay = isTurbo() ? minDelay : maxDelay;
            timer = setTimeout(play, delay);
        };

        if (animation !== lastAni) {
            index = 0;
        }
        lastAni = animation;
        play();
        select.setAttribute("disabled", "disabled");
        startBtn.setAttribute("disabled", "disabled");
    };

    stopBtn.onclick = function() {
        clearTimeout(timer);
        startBtn.removeAttribute("disabled");
        select.removeAttribute("disabled");
    };
};
