/**
 * author : yujielee
 * @brief total 157 lines
 * @details 实现了大部分功能，为了代码的可读性与可维护性，
 *          仍然选择了坚持超过要求行数的做法，但页面加载时，
 *          不加载此 JS，而加载压缩后的 JS
 */
;$(function() {
    var $puzzleArea = $("#puzzlearea");
    var puzzlePieces = $puzzleArea.find("div");
    var $shuffleBtn = $("#shufflebutton");
    var $ctrls = $("#controls");
    var columns = 4,
        steps = 0,
        areaLength = 400,
        isMoving = false;
    var blank;
    // 获得垂直位置
    function getTop(index) {
        return Math.floor(index / columns) * areaLength / columns;
    }
    // 获得顶部位置
    function getLeft(index) {
        return (index % columns) * areaLength / columns;
    }
    // 移动滑块
    function swapPosition(element, delay) {
        if (!nearBlank(element) || isMoving) {
            return;
        }
        var tmp = {
            top: element.css('top'),
            left: element.css('left')
        };
        isMoving = true;
        element.animate({
            top: blank.top,
            left: blank.left
        }, delay, function() {
            isMoving = false;
            blank = tmp;
            steps++;
            refreshScreen();
            if (delay != 0) {
                addMove();
            }
            if (isFinish() && steps !== 0 && delay !== 0) {
                youWin();
            }
        });
    }
    // 判断是否相邻
    function nearBlank(element) {
        var dist = {
            vertical: Math.abs(parseInt(element.css('top')) - parseInt(blank.top)),
            horizon: Math.abs(parseInt(element.css('left')) - parseInt(blank.left))
        };
        return dist.vertical + dist.horizon === Math.ceil(areaLength / columns) || dist.vertical + dist.horizon === Math.floor(areaLength / columns);
    }
    // 判断是否完成
    function isFinish() {
        for (var i = 0; i < columns * columns - 1; i++) {
            var pos = $(puzzlePieces[i]).css('background-position').split(" ");
            if (parseInt($(puzzlePieces[i]).css('top')) !== -parseInt(pos[1]) || parseInt($(puzzlePieces[i]).css('left')) !== -parseInt(pos[0])) {
                return false;
            }
        }
        return true;
    }
    // 初始化监听器
    function addListener() {
        $("#puzzlearea div").remove();
        blank = {
            top: getTop(columns * columns - 1),
            left: getLeft(columns * columns - 1)
        };
        for (var i = 0; i < columns * columns - 1; i++) {
            $puzzleArea.append($("<div></div>").text(i + 1));
            puzzlePieces = $puzzleArea.find("div");
            $(puzzlePieces[i]).addClass('puzzlepiece');
            $(puzzlePieces[i]).css({
                'top': getTop(i),
                'left': getLeft(i),
                'background-position': -1 * getLeft(i) + 'px ' + (-1) * getTop(i) + 'px',
                'width': areaLength / columns - 4 + 'px',
                'height': areaLength / columns - 4 + 'px'
            });
            $(puzzlePieces[i]).click(function(event) {
                swapPosition($(event.target), 300);
            });
        }
        addMove();
    }
    // 洗牌
    function refresh() {
        var count = 400;
        $(puzzlePieces).fadeIn('100');
        $("#puzzlearea h2").fadeOut('100');
        $puzzleArea.css('background-image', 'none');
        while (count--) {
            var index = Math.floor(Math.random() * (columns * columns - 1));
            swapPosition($(puzzlePieces[index]), 0);
        }
        steps = 0;
        refreshScreen();
        addMove();
    }
    // 更改选择框时的行为
    function selectOnChange() {
        $("#change-bg").change(function(event) {
            for (var i = 0; i < columns * columns - 1; i++) {
                $(puzzlePieces[i]).css('background-image', 'url(' + $(event.target).val() + '.jpg)');
            }
        });
        $("#change-len").change(function(event) {
            columns = parseInt($(event.target).val());
            $puzzleArea.css('background-image', 'none');
            addListener();
        });
    }
    // 增加控制组件节点
    function addController(callback) {
        var bgList = ["background", "background1", "background2", "background3"];
        var bgLen = ["4x4", "5x5", "6x6", "7x7"];
        var changeBg = $("<select id='change-bg'></select>");
        var changeLen = $("<select id='change-len'></select>");
        for (var i = 0; i < 4; i++) {
            changeBg.append($("<option></option>").text(bgList[i]).attr("value", bgList[i]));
            changeLen.append($("<option></option>").text(bgLen[i]).attr("value", bgLen[i]));
        }
        $ctrls.append(changeBg);
        $ctrls.append(changeLen);
        callback();
    }
    // 增加显示步数的屏幕节点
    function addScreen() {
        var $scrn = $('<span id="screen"></span>');
        $ctrls.append($scrn);
        refreshScreen();
    }
    // 更新屏幕
    function refreshScreen() {
        $("#screen").text(steps);
    }
    // 给相邻块增加 movablepiece 类
    function addMove() {
        for (var i = 0; i < columns * columns - 1; i++) {
            $(puzzlePieces[i]).removeClass("movablepiece");
            if (nearBlank($(puzzlePieces[i]))) {
                $(puzzlePieces[i]).addClass("movablepiece");
            }
        }
    }
    // 胜利时的行为
    function youWin() {
        $puzzleArea.css('background-image', 'url(' + $('#change-bg').val() + '.jpg)');
        $puzzleArea.append($('<h2></h2>').text("You Win!\nsteps:" + steps));
        $(puzzlePieces).fadeOut('100');
    }
    addListener();
    addController(selectOnChange);
    addScreen();
    $shuffleBtn.click(refresh);
});