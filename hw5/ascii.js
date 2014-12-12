window.onload = function() {
    var index = 0,
    minDelay  = 50,
    maxDelay  = 200;

    var startBtn = document.getElementsByName("start")[0];
    var stopBtn = document.getElementsByName("stop")[0];
    var displayArea = document.getElementById("displayarea");
    var select = document.getElementsByTagName("select")[0];

    var isTurbo = function() {
        var turbo = document.getElementsByName("speed")[0];
        return turbo.checked;
    }

    // Get the value of input[type="radio",name="size"]
    var getSize = function() {
        var sizeRadio = document.getElementsByName("size");
        var idx = 0;
        var num;

        for (var i = 0; i < sizeRadio.length; i++) {
            if (sizeRadio[i].checked) {
                idx = i;
                break;
            }
        }
        switch(idx){
            case 0:
                num = "7pt";
                break;
            case 1:
                num = "12pt";
                break;
            case 2:
                num = "24pt";
                break;
            default:
                break;
        }
        return num;
    }
    //bind the click event
    startBtn.onclick = function() {
        
        var animation = select.value;
        var frameList = ANIMATIONS[animation].split("=====\n");
        select.disabled = true;

        var play = function() {
            index = index >= frameList.length-1 ? 0 : index+1;
            displayArea.value = frameList[index];
            displayArea.style.fontSize = getSize();
            timer = setTimeout(play, isTurbo() ? minDelay : maxDelay);
        }

        play();
        startBtn.setAttribute("disabled", "disabled");
    }

    stopBtn.onclick = function() {
        clearTimeout(timer);
        startBtn.removeAttribute("disabled");
        select.disabled = false;
    }
}